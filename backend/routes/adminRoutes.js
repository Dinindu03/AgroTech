// routes/adminRoutes.js

const express = require("express");
const router = express.Router();
const db = require("../db");

// Admin Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql =
    "SELECT * FROM admins WHERE email = ? AND password = ?";

  db.query(sql, [email, password], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }

    if (result.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    res.status(200).json({
      success: true,
      message: "Admin Login Successful",
      user: {
        id: result[0].id,
        name: result[0].name,
        email: result[0].email,
        role: "admin",
      },
    });
  });
});

module.exports = router;