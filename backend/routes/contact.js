const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/message", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: "Name, email, and message are all required." });
  }

  db.query(
    `INSERT INTO contact_messages (name, email, message, created_at, message_status)
     VALUES (?, ?, ?, NOW(),'pending')`,
    [name, email, message],
    (err, result) => {
      if (err) {
        console.error("Contact message error:", err);
        return res.status(500).json({ success: false, message: "Server error submitting your message." });
      }
      return res.json({ success: true, message: "Message sent — we'll be in touch soon." });
    }
  );
});

// GET: Fetch all contact messages
router.get("/all", (req, res) => {
  db.query(
    `SELECT 
        id AS complaint_id, 
        name AS consignee_name, 
        email, 
        message, 
        created_at, 
        message_status AS status 
     FROM contact_messages 
     ORDER BY created_at DESC`,
    (err, rows) => {
      if (err) {
        console.error("Error fetching messages:", err);
        return res.status(500).json({ success: false, message: "Failed to retrieve messages." });
      }
      return res.json({ success: true, messages: rows });
    }
  );
});

// PUT: Update message status
router.put("/update-status/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  db.query(
    `UPDATE contact_messages SET message_status = ? WHERE id = ?`,
    [status, id],
    (err, result) => {
      if (err) {
        console.error("Error updating status:", err);
        return res.status(500).json({ success: false, message: "Failed to update status." });
      }
      return res.json({ success: true, message: "Status updated successfully." });
    }
  );
});

// DELETE: Remove a message
router.delete("/delete/:id", (req, res) => {
  const { id } = req.params;

  db.query(`DELETE FROM contact_messages WHERE id = ?`, [id], (err, result) => {
    if (err) {
      console.error("Error deleting message:", err);
      return res.status(500).json({ success: false, message: "Failed to delete message." });
    }
    return res.json({ success: true, message: "Message deleted successfully." });
  });
});

module.exports = router;