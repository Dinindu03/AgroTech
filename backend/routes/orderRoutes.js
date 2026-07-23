const express = require("express");
const router = express.Router();
const db = require("../db");

// ===============================
// CREATE ORDER
// ===============================
router.post("/create", async (req, res) => {
  const {
    consigneeName,
    email,
    phone,
    address,
    city,
    postalCode,
    paymentMethod,
    subtotal,
    shippingFee,
    totalAmount,
    items,
  } = req.body;

  if (!items || !items.length) {
    return res.status(400).json({
      success: false,
      message: "Order must contain at least one item.",
    });
  }

  const orderSQL = `
    INSERT INTO orders
    (consignee_name, email, phone,  total_amount)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    orderSQL,
    [
      consigneeName,
      email,
      phone,
      
     
      totalAmount,
     
    ],
    (err, result) => {
      if (err) {
        console.error("❌ Order Insert Error:", err);
        return res.status(500).json({ success: false, message: err.sqlMessage });
      }

      const orderId = result.insertId;

      // ===============================
      // INSERT PAYMENT
      // ===============================
      const paymentSQL = `
        INSERT INTO payments (order_id, payment_method, amount, payment_status, transaction_ref)
        VALUES (?, ?, ?, ?, ?)
      `;

      db.query(
        paymentSQL,
        [orderId, paymentMethod, totalAmount, "Pending", null],
        (err) => {
          if (err) {
            console.error("❌ Payment Insert Error:", err);
            return res.status(500).json({ success: false, message: err.sqlMessage });
          }

          // ===============================
          // INSERT SHIPPING
          // ===============================
          const shippingSQL = `
            INSERT INTO shipping
            (order_id, shipping_name, shipping_address, shipping_city,
             shipping_postal_code, shipping_status)
            VALUES (?, ?, ?, ?, ?, ?)
          `;

          db.query(
            shippingSQL,
            [orderId, consigneeName, address, city, postalCode, "Processing"],
            (err) => {
              if (err) {
                console.error("❌ Shipping Insert Error:", err);
                return res.status(500).json({ success: false, message: err.sqlMessage });
              }

              // ===============================
              // INSERT ORDER ITEMS
              // ===============================
              const itemSQL = `
                INSERT INTO order_items (order_id, product_id, product_name, quantity, price)
                VALUES ?
              `;

              const itemValues = items.map((item) => [
                orderId,
                item.productId,
                item.productName,
                item.quantity,
                item.price,
              ]);

              db.query(itemSQL, [itemValues], (err) => {
                if (err) {
                  console.error("❌ Items Insert Error:", err);
                  return res.status(500).json({ success: false, message: err.sqlMessage });
                }

                // ===============================
                // UPDATE PRODUCT STOCK
                // ===============================
                let completedUpdates = 0;
                let hasErrored = false;

                items.forEach((item) => {
                  const stockSQL = `UPDATE products SET stock = stock - ? WHERE product_id = ?`;

                  db.query(stockSQL, [item.quantity, item.productId], (err) => {
                    if (err) {
                      console.error("❌ Stock Update Error:", err);
                      if (!hasErrored) {
                        hasErrored = true;
                        return res.status(500).json({ success: false, message: err.sqlMessage });
                      }
                      return;
                    }

                    completedUpdates++;

                    if (completedUpdates === items.length && !hasErrored) {
                      res.status(201).json({
                        success: true,
                        message: "Order created successfully",
                        orderId,
                      });
                    }
                  });
                });
              });
            }
          );
        }
      );
    }
  );
});

// ===============================
// GET ALL ORDERS
// ===============================
router.get("/all", (req, res) => {
  const sql = `
    SELECT
      o.order_id, o.consignee_name, o.email, o.phone, s.shipping_address,  p.payment_method , o.total_amount, o.order_date,s.shipping_status
    FROM orders o
    left join shipping s
    on o.order_id=s.order_id
    left join payments p
    on o.order_id =p.order_id
    ORDER BY order_date DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ FETCH ORDERS MYSQL ERROR:", err);
      return res.status(500).json({ success: false, message: err.sqlMessage });
    }
    res.status(200).json({ success: true, orders: results });
  });
});

// ===============================
// GET ORDERS FOR PACKING (grouped with items)
// ===============================
router.get("/P", (req, res) => {
  const sql = `
    SELECT
    o.order_id,
    o.consignee_name,
    o.email,
    o.phone,
    s.shipping_address,
    s.shipping_city,
    o.order_date,
    s.shipping_status,
    oi.product_id,
    oi.product_name,
    oi.price,
    oi.quantity
FROM orders o
LEFT JOIN order_items oi
    ON oi.order_id = o.order_id
LEFT JOIN shipping s
    ON s.order_id = o.order_id
WHERE s.shipping_status = 'Processing'
ORDER BY o.order_date DESC
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      console.error("❌ FETCH ORDERS MYSQL ERROR:", err);
      return res.status(500).json({ success: false, message: err.sqlMessage });
    }

    const ordersMap = new Map();

    for (const row of rows) {
      if (!ordersMap.has(row.order_id)) {
        ordersMap.set(row.order_id, {
          order_id: row.order_id,
          consignee_name: row.consignee_name,
          email: row.email,
          phone: row.phone,
          shipping_address: row.shipping_address,
          shipping_city: row.shipping_city,
          postal_code: row.postal_code,
          order_date: row.order_date,
          shipping_status: row.shipping_status,
          items: [],
        });
      }

      ordersMap.get(row.order_id).items.push({
        product_id: row.product_id,
        product_name: row.product_name,
        price: row.price,
        quantity: row.quantity,
      });
    }

    const orders = Array.from(ordersMap.values());

    res.status(200).json({ success: true, orders });
  });
});

router.get("/S", (req, res) => {
  const sql = `
    SELECT
      o.order_id,
      o.consignee_name,
      o.email,
      o.phone,
      o.total_amount,
      o.order_date,
      s.shipping_address AS address,
      s.shipping_city AS city,
      s.shipping_postal_code AS postal_code,
      s.shipping_status,
      s.tracking_number,
      s.shipping_ref,
      s.shipping_date,
      p.payment_method,
      oi.product_id,
      oi.product_name,
      oi.price,
      oi.quantity
    FROM orders o
    LEFT JOIN shipping s ON s.order_id = o.order_id
    LEFT JOIN payments p ON p.order_id = o.order_id
    LEFT JOIN order_items oi ON oi.order_id = o.order_id
    WHERE LOWER(s.shipping_status) = 'packed' OR LOWER(s.shipping_status) = 'ready to ship'
    ORDER BY o.order_date DESC
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      console.error("❌ FETCH SHIPPING ORDERS ERROR:", err);
      return res.status(500).json({ success: false, message: err.sqlMessage });
    }

    const ordersMap = new Map();

    for (const row of rows) {
      if (!ordersMap.has(row.order_id)) {
        ordersMap.set(row.order_id, {
          order_id: row.order_id,
          consignee_name: row.consignee_name,
          email: row.email,
          phone: row.phone,
          address: row.address,
          city: row.city,
          postal_code: row.postal_code,
          total_amount: row.total_amount,
          order_date: row.order_date,
          shipping_status: row.shipping_status,
          tracking_number: row.tracking_number,
          shipping_ref: row.shipping_ref,
          shipping_date: row.shipping_date,
          payment_method: row.payment_method,
          items: [],
        });
      }

      if (row.product_id) {
        ordersMap.get(row.order_id).items.push({
          product_id: row.product_id,
          product_name: row.product_name,
          price: row.price,
          quantity: row.quantity,
        });
      }
    }

    const orders = Array.from(ordersMap.values());
    res.status(200).json({ success: true, orders });
  });
});


// UPDATE SHIPPING STATUS Packaging to shipping

router.put("/update-status/:orderId", (req, res) => {
  const { orderId } = req.params;
  const { shipping_status } = req.body;

  if (!shipping_status) {
    return res.status(400).json({
      success: false,
      message: "shipping_status is required",
    });
  }

  const sql = `
    UPDATE shipping
    SET shipping_status = ?
    WHERE order_id = ?
  `;

  db.query(sql, [shipping_status, orderId], (err, result) => {
    if (err) {
      console.error("❌ UPDATE STATUS ERROR:", err);

      return res.status(500).json({
        success: false,
        message: "Database error",
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Shipping status updated successfully",
      orderId,
      shipping_status,
    });
  });
});


// update quary packed to shipped 

router.put("/update-status-shiped/:orderId", (req, res) => {
  const { orderId } = req.params;
  const { shipping_status, tracking_number, shipping_ref, shipping_date } = req.body;

  if (!shipping_status) {
    return res.status(400).json({
      success: false,
      message: "shipping_status is required",
    });
  }

  const sql = `
    UPDATE shipping
    SET 
      shipping_status = ?,
      tracking_number = ?,
      shipping_ref = ?,
      shipping_date = ?
    WHERE order_id = ?
  `;

  db.query(
    sql,
    [
      shipping_status,
      tracking_number || null,
      shipping_ref || null,
      shipping_date || null,
      orderId,
    ],
    (err, result) => {
      if (err) {
        console.error("❌ UPDATE SHIPPING DETAILS ERROR:", err);
        return res.status(500).json({
          success: false,
          message: err.sqlMessage || "Database error updating shipping details",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Order not found in shipping table",
        });
      }

      res.status(200).json({
        success: true,
        message: "Shipping tracking details saved successfully!",
        orderId,
        shipping_status,
        tracking_number,
        shipping_ref,
        shipping_date,
      });
    }
  );
});

module.exports = router;