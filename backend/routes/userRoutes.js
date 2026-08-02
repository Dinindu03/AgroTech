const express = require("express");
const router = express.Router();
const db = require("../db");


router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Route Working",
  });
});

// Register User
router.post("/register", (req, res) => {
  const { name, fullname, email, password, nic } =
    req.body;

  const checkEmail =
    "SELECT * FROM user WHERE email = ?";

  db.query(checkEmail, [email], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Database Error",
      });
    }

    if (result.length > 0) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const sql = `
      INSERT INTO user
      (name, fullname, email, password, nic)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [name, fullname, email, password, nic],
      (err) => {
        if (err) {
          return res.status(500).json({
            message: err.message,
          });
        }

        res.status(201).json({
          success: true,
          message: "User Registered Successfully",
        });
      }
    );
  });
});

// Login User
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = `
    SELECT id, name, fullname, email
    FROM user
    WHERE email = ? AND password = ?
  `;

  db.query(
    sql,
    [email, password],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Database Error",
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
        message: "Login Successful",
        user: result[0],
      });
    }
  );
});


router.get("/", (req, res) => {
  db.query(
    "SELECT * FROM user",
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      res.status(200).json(result);
    }
  );
});

module.exports = router;