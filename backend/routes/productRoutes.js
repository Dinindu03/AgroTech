const express = require("express");
const router = express.Router();
const db = require("../db");

// Add Product
router.post("/add", (req, res) => {
  const {
    id,
    name,
    brand,
    category,
    price,
    stock,
    supplier,
    enteredBy,
    date,
    description,
    image,
  } = req.body;

  // Validation
  if (!id || !name || !category || !price || !stock) {
    return res.status(400).json({
      message: "Please fill required fields",
    });
  }

  const sql = `
    INSERT INTO products 
    (id, name, brand, category, price, stock, supplier, enteredBy, date, description, image)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [id, name, brand, category, price, stock, supplier, enteredBy, date, description, image],
    (err, result) => {
      if (err) {
        console.log("DB Error:", err);
        return res.status(500).json({
          message: "Database Error",
        });
      }

      res.status(201).json({
        message: "Product Added Successfully",
        productId: result.insertId,
      });
    }
  );
});

module.exports = router;