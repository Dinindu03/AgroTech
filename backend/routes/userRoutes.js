const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/add", (req, res) => {
  const {
    name,
    fullname,
    email,
    password,
    nic,
  } = req.body;

  const sql = `
    INSERT INTO user
    (name, fullname, email, password, nic)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [name, fullname, email, password, nic],
    (err, result) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message: "Database Error",
          error: err.message,
        });
      }

      res.status(201).json({
        message: "User registered successfully",
      });
    }
  );
});

// Get all users
router.get("/", (req, res) => {
  db.query("SELECT * FROM user", (err, result) => {
    if (err) {
      return res.status(500).json({
        message: err.message,
      });
    }

    res.json(result);
  });
});

module.exports = router;