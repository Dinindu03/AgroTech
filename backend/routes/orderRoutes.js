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
    (consignee_name, email, phone, address, city, postal_code,
     payment_method, subtotal, shipping_fee, total_amount, shipping_status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    orderSQL,
    [
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
      "Processing",
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
             shipping_postal_code, shipping_status, shipping_date)
            VALUES (?, ?, ?, ?, ?, ?, NOW())
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
              // INSERT ORDER ITEMS  (now correctly nested inside shipping callback)
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
                  const stockSQL = `UPDATE products SET stock = stock - ? WHERE  product_id = ?`;

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
      order_id , consignee_name, email, phone, address, city, postal_code,
      payment_method, subtotal, shipping_fee, total_amount, order_date, shipping_status
    FROM orders
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

module.exports = router;