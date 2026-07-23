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

module.exports = router;