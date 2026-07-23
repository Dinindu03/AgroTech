const express = require("express");
const router = express.Router();

// The shared ../db pool is callback-style (used by login, orders, etc).
// .promise() wraps that SAME pool so we can use await here without
// touching db.js or breaking any other route.
const db = require("../db").promise();

// ======================================
// DASHBOARD SUMMARY
// ======================================
router.get("/summary", async (req, res) => {
  try {
    // Total Products
    const [[{ totalProducts }]] = await db.query(`
      SELECT COUNT(*) AS totalProducts
      FROM products
    `);

    // Active Orders
    const [[{ activeOrders }]] = await db.query(`
      SELECT COUNT(*) AS activeOrders
      FROM shipping
      WHERE shipping_status NOT IN ('Delivered', 'Cancelled')
    `);

    // Gross Revenue
    const [[{ grossRevenue }]] = await db.query(`
      SELECT COALESCE(SUM(o.total_amount), 0) AS grossRevenue
      FROM orders o
      INNER JOIN shipping s
        ON s.order_id = o.order_id
      WHERE s.shipping_status <> 'Cancelled'
    `);

    // Total Stock Units
    const [[{ stockUnits }]] = await db.query(`
      SELECT COALESCE(SUM(stock), 0) AS stockUnits
      FROM products
    `);

    res.status(200).json({
      success: true,
      data: {
        totalProducts: Number(totalProducts),
        activeOrders: Number(activeOrders),
        grossRevenue: Number(grossRevenue),
        stockUnits: Number(stockUnits),
      },
    });
  } catch (err) {
    console.error("Dashboard Summary Error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to load dashboard summary",
    });
  }
});

// ======================================
// MONTHLY REVENUE (LAST 6 MONTHS)
// ======================================
router.get("/revenue", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
    DAY(o.order_date) AS day,
    COALESCE(SUM(o.total_amount), 0) AS revenue
FROM orders o
INNER JOIN shipping s
    ON s.order_id = o.order_id
WHERE s.shipping_status <> 'Cancelled'
  AND YEAR(o.order_date) = YEAR(CURDATE())
  AND MONTH(o.order_date) = MONTH(CURDATE())
GROUP BY DAY(o.order_date)
ORDER BY DAY(o.order_date)
    `);
    res.status(200).json({
      success: true,
      data: rows.map((row) => ({
        day: row.day,
        revenue: Number(row.revenue),
      })),
    });
  } catch (err) {
    console.error("Dashboard Revenue Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to load revenue data",
    });
  }
});

// ======================================
// STOCK DISTRIBUTION BY CATEGORY
// ======================================
router.get("/stock-distribution", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        category AS name,
        COALESCE(SUM(stock), 0) AS value
      FROM products
      GROUP BY category
      ORDER BY value DESC
    `);
    res.status(200).json({
      success: true,
      data: rows.map((row) => ({
        name: row.name,
        value: Number(row.value),
      })),
    });
  } catch (err) {
    console.error("Dashboard Stock Distribution Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to load stock distribution",
    });
  }
});

module.exports = router;