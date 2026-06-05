const express = require("express");
const router = express.Router();
const db = require("../db");

// Login
router.post("/", (req, res) => {
  const { email, password } = req.body;

  const sql = `
    SELECT id, name, email
    FROM user
    WHERE email = ? AND password = ?
  `;

  db.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Database Error",
      });
    }

    if (results.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      user: results[0],
    });
  });
});

module.exports = router;