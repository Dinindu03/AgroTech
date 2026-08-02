const express = require("express");
const router = express.Router();

const db = require("../db");


const queryAsync = (sql, params) =>
  new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });


router.get("/my-orders/:email", async (req, res) => {
  const { email } = req.params;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required.",
    });
  }

  try {
  
    const ordersSQL = `
      SELECT
    o.order_id,
    
    o.email,
    o.phone,
 
   
   

  
   
    o.total_amount,
    o.order_date,
  

    s.shipping_id,
    
    s.shipping_address,
    s.shipping_city,
    s.shipping_postal_code,
   
    s.shipping_ref,
    s.tracking_number,
    s.shipping_date,
    s.delivered_date,
    s.shipping_status,
    p.payment_id,
    p.payment_status,
    p.transaction_ref,
    p.amount AS payment_amount,
    p.payment_date,
    p.payment_method

FROM orders o

LEFT JOIN shipping s 
ON s.order_id = o.order_id

LEFT JOIN payments p 
ON p.order_id = o.order_id

WHERE o.email = ?

ORDER BY o.order_date DESC
    `;

    const orders = await queryAsync(ordersSQL, [email]);

    if (orders.length === 0) {
      return res.status(200).json({ success: true, orders: [] });
    }

    // 2) Line items for every order returned above, in one query.
    const orderIds = orders.map((o) => o.order_id);

    const itemsSQL = `
      SELECT
        order_id,
        product_id,
        product_name,
        quantity,
        price
      FROM order_items
      WHERE order_id IN (?)
    `;

    const items = await queryAsync(itemsSQL, [orderIds]);

    // 3) Group items under their order_id so the frontend gets a clean
    //    nested shape: each order carries its own `items` array.
    const itemsByOrder = items.reduce((acc, item) => {
      if (!acc[item.order_id]) acc[item.order_id] = [];
      acc[item.order_id].push(item);
      return acc;
    }, {});

    const ordersWithItems = orders.map((order) => ({
      ...order,
      items: itemsByOrder[order.order_id] || [],
    }));

    res.status(200).json({
      success: true,
      orders: ordersWithItems,
    });
  } catch (err) {
    console.error("❌ FETCH SHIPPING DETAILS ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.sqlMessage || "Failed to fetch shipping details.",
    });
  }
});

router.put("/confirm-delivery/:order_id", (req, res) => {
  const { order_id } = req.params;

  db.query(
    `UPDATE shipping  
     SET shipping_status = 'Delivered',
         
         delivered_date = NOW()
     WHERE order_id = ?`,
    [order_id],
    (err, result) => {
      if (err) {
        console.error("Confirm delivery error:", err);
        return res.status(500).json({ success: false, message: "Server error confirming delivery." });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: "Order not found." });
      }
      return res.json({ success: true, message: "Delivery confirmed." });
    }
  );
});

router.put("/deactivate-order/:order_id", async (req, res) => {
  const { order_id } = req.params;
  const { reason } = req.body;

  if (!reason || reason.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Reason is required.",
    });
  }

  try {
    // Check order
    const order = await queryAsync(
      `SELECT order_status
       FROM orders
       WHERE order_id = ?`,
      [order_id]
    );

    if (order.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    if (order[0].is_active === 0) {
      return res.status(400).json({
        success: false,
        message: "Order already deactivated.",
      });
    }

    // Get ordered products
    const items = await queryAsync(
      `SELECT product_id, quantity
       FROM order_items
       WHERE order_id = ?`,
      [order_id]
    );

    // Restock products
    for (const item of items) {
      await queryAsync(
        `UPDATE products
         SET stock = stock + ?
         WHERE product_id = ?`,
        [item.quantity, item.product_id]
      );
    }

    // Update order
    await queryAsync(
      `UPDATE orders
       SET order_status = 'DeActive',
           deactive_reason = ?
          
       WHERE order_id = ?`,
      [reason, order_id]
    );

    // Update shipping
    await queryAsync(
      `UPDATE shipping
       SET shipping_status = 'Deactivated'
       WHERE order_id = ?`,
      [order_id]
    );

    res.json({
      success: true,
      message: "Order deactivated and stock restored successfully.",
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.sqlMessage || "Server error",
    });
  }
});



router.post("/reviews/add", async (req, res) => {

  const {
    order_id,
    user_email,
    rating,
    review
  } = req.body;


  if (!order_id || !user_email || !rating) {
    return res.status(400).json({
      success: false,
      message: "Order id, email and rating required."
    });
  }


  try {

    // Get products from order
    const items = await queryAsync(
      `
      SELECT product_id
      FROM order_items
      WHERE order_id = ?
      `,
      [order_id]
    );


    if (items.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found for this order."
      });
    }


    // Insert or update reviews
    for (const item of items) {


      const exist = await queryAsync(
        `
        SELECT review_id
        FROM product_reviews
        WHERE order_id = ?
        AND product_id = ?
        AND user_email = ?
        `,
        [
          order_id,
          item.product_id,
          user_email
        ]
      );


      // New review
      if (exist.length === 0) {


        await queryAsync(
          `
          INSERT INTO product_reviews
          (
            order_id,
            product_id,
            user_email,
            rating,
            review
          )
          VALUES(?,?,?,?,?)
          `,
          [
            order_id,
            item.product_id,
            user_email,
            rating,
            review
          ]
        );


      } 
      
      // Update existing review
      else {


        await queryAsync(
          `
          UPDATE product_reviews
          SET
            rating = ?,
            review = ?
          WHERE order_id = ?
          AND product_id = ?
          AND user_email = ?
          `,
          [
            rating,
            review,
            order_id,
            item.product_id,
            user_email
          ]
        );


      }

    }


    res.json({
      success: true,
      message: "Review added/updated successfully."
    });


  } catch (err) {

    console.error("ADD REVIEW ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Server error while adding review."
    });

  }

});


// ===============================
// SUBMIT RETURN REQUEST
// ===============================
router.post("/return", async (req, res) => {

  const {
    order_id,
    user_email,
    reason
  } = req.body;


  if (!order_id || !user_email || !reason) {
    return res.status(400).json({
      success:false,
      message:"Order id, email and reason are required."
    });
  }


  try {


    // Check order exists
    const order = await queryAsync(
      `
      SELECT order_id
      FROM orders
      WHERE order_id = ?
      `,
      [order_id]
    );


    if(order.length === 0){

      return res.status(404).json({
        success:false,
        message:"Order not found."
      });

    }



    // Check existing return request
    const existing = await queryAsync(
      `
      SELECT return_id
      FROM returns
      WHERE order_id = ?
      AND user_email = ?
      `,
      [
        order_id,
        user_email
      ]
    );


    if(existing.length > 0){

      return res.status(400).json({
        success:false,
        message:"Return request already submitted."
      });

    }



    // Insert return request
    await queryAsync(
      `
      INSERT INTO returns
      (
        order_id,
        user_email,
        reason,
        return_status
      )
      VALUES(?,?,?,?)
      `,
      [
        order_id,
        user_email,
        reason,
        "Requested"
      ]
    );



    // Update shipping status
    await queryAsync(
      `
      UPDATE shipping
      SET shipping_status = 'Return'
      WHERE order_id = ?
      `,
      [order_id]
    );



    res.json({
      success:true,
      message:"Return request submitted successfully."
    });



  } catch(err){

    console.error("RETURN REQUEST ERROR:",err);

    res.status(500).json({
      success:false,
      message:"Server error while submitting return request."
    });

  }

});


module.exports = router;