const express = require("express");
const router = express.Router();
const db = require("../db");

// ── GET /api/products/search?query=xxx ─────────────────────────
// Matches by exact Product ID OR partial name match
router.get("/search", (req, res) => {
  const { query } = req.query;

  if (!query || !query.trim()) {
    return res.status(400).json({ success: false, message: "Search query is required." });
  }

  const term = query.trim();

  db.query(
    `SELECT product_id AS id, name, brand, category, price, stock, supplier,
            enteredBy , date , description
     FROM products
     WHERE product_id = ? OR name LIKE ?
     ORDER BY name ASC
     LIMIT 20`,
    [term, `%${term}%`],
    (err, rows) => {
      if (err) {
        console.error("Search products error:", err);
        return res.status(500).json({ success: false, message: "Server error searching products." });
      }
      if (rows.length === 0) {
        return res.json({ success: false, message: "No matching products found.", products: [] });
      }
      return res.json({ success: true, products: rows });
    }
  );
});

// ── PUT /api/products/update/:id ───────────────────────────────
// Updates every field EXCEPT product_id, which is the route param
// and is never part of the SET clause.
router.put("/update/:id", (req, res) => {
  const { id } = req.params;
  const { name, brand, category, price, stock, supplier, enteredBy, date, description } = req.body;

  if (!name || !category || price === undefined || price === null || stock === undefined || stock === null) {
    return res.status(400).json({
      success: false,
      message: "Name, category, price, and stock are required.",
    });
  }

  db.query(
    `UPDATE products
     SET name = ?, brand = ?, category = ?, price = ?, stock = ?,
         supplier = ?, enteredby = ?, date = ?, description = ?
     WHERE product_id = ?`,
    [
      name,
      brand || null,
      category,
      price,
      stock,
      supplier || null,
      enteredBy || null,
      date || null,
      description || null,
      id, // product_id — used only in WHERE, never updated
    ],
    (err, result) => {
      if (err) {
        console.error("Update product error:", err);
        return res.status(500).json({ success: false, message: "Server error updating product." });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: "Product not found." });
      }
      return res.json({ success: true, message: "Product updated successfully." });
    }
  );
});

module.exports = router;