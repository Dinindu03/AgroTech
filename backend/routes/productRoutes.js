const express = require("express");
const router = express.Router();
const db = require("../db");

// ===============================
// GET ALL PRODUCTS
// ===============================
router.get("/all", (req, res) => {
  const sql = "SELECT * FROM products ORDER BY date DESC";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Fetch Error:", err);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch products",
      });
    }

    res.status(200).json({
      success: true,
      count: results.length,
      products: results,
    });
  });
});

// ===============================
// ADD PRODUCT
// ===============================
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

  if (
    !id ||
    !name ||
    !category ||
    price === "" ||
    stock === ""
  ) {
    return res.status(400).json({
      success: false,
      message: "Required fields are missing",
    });
  }

  const sql = `
    INSERT INTO products
    (
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
      image
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
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
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Insert Error:", err);

      return res.status(500).json({
        success: false,
        message: "Failed to add product",
      });
    }

    res.status(201).json({
      success: true,
      message: "Product Added Successfully",
      insertedId: result.insertId,
    });
  });
});

module.exports = router;