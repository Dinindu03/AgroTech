import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  Paper,
  Button,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/SearchOutlined";
import MailOutlineIcon from "@mui/icons-material/MailOutlineRounded";
import MarkEmailUnreadIcon from "@mui/icons-material/MarkEmailUnreadOutlined";
import HourglassEmptyRoundedIcon from "@mui/icons-material/HourglassEmptyRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";

import AdminSidebar from "../components/AdminNavbar";

const SIDEBAR_WIDTH = 260;
const API_URL = "http://localhost:5000/api/contact/all";

const statusStyle = (status) => {
  switch (status) {
    case "Open":
      return { bgcolor: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" };
    case "In Progress":
      return { bgcolor: "#fff7ed", color: "#c2410c", border: "1px solid #fed7aa" };
    case "Resolved":
      return { bgcolor: "#f0fdf4", color: "#15803d", border: "1px solid #dcfce7" };
    case "pending":
      return { bgcolor: "#fefce8", color: "#a16207", border: "1px solid #fef08a" };
    default:
      return { bgcolor: "#f8fafc", color: "#475569", border: "1px solid #e2e8f0" };
  }
};

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // Delete confirm target
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      if (res.data.success) {
        setMessages(res.data.messages || res.data.data || []);
      }
    } catch (err) {
      console.error("Fetch Messages Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Directly cycles status: Open/pending -> In Progress -> Resolved -> Open
  const handleToggleStatus = async (message) => {
    const msgId = message.id || message.complaint_id;
    const currentStatus = message.status || message.message_status || "Open";

    let newStatus = "Open";
    if (currentStatus === "Open" || currentStatus === "pending") {
      newStatus = "In Progress";
    } else if (currentStatus === "In Progress") {
      newStatus = "Resolved";
    } else {
      newStatus = "Open";
    }

    try {
      setUpdatingId(msgId);

      const res = await axios.put(
        `http://localhost:5000/api/contact/update-status/${msgId}`,
        { status: newStatus }
      );

      if (res.data.success) {
        setMessages((prev) =>
          prev.map((m) => {
            const id = m.id || m.complaint_id;
            return id === msgId
              ? { ...m, status: newStatus, message_status: newStatus }
              : m;
          })
        );
      }
    } catch (err) {
      console.error("Update Message Status Error:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const message = deleteTarget;
    const msgId = message.id || message.complaint_id;
    setDeleteTarget(null);

    try {
      setUpdatingId(msgId);

      const res = await axios.delete(
        `http://localhost:5000/api/contact/delete/${msgId}`
      );

      if (res.data.success) {
        setMessages((prev) =>
          prev.filter((m) => (m.id || m.complaint_id) !== msgId)
        );
      }
    } catch (err) {
      console.error("Delete Message Error:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredMessages = messages.filter((m) => {
    const searchValue = search.toLowerCase();
    const idStr = String(m.id || m.complaint_id || m.order_id || "");
    const nameStr = (m.consignee_name || m.name || "").toLowerCase();
    const emailStr = (m.email || "").toLowerCase();
    const subjectStr = (m.subject || "").toLowerCase();
    const msgStr = (m.message || "").toLowerCase();

    return (
      idStr.includes(searchValue) ||
      nameStr.includes(searchValue) ||
      emailStr.includes(searchValue) ||
      subjectStr.includes(searchValue) ||
      msgStr.includes(searchValue)
    );
  });

  const getStatus = (m) => m.status || m.message_status || "Open";

  const openCount = messages.filter((m) => getStatus(m) === "Open" || getStatus(m) === "pending").length;
  const inProgressCount = messages.filter((m) => getStatus(m) === "In Progress").length;
  const resolvedCount = messages.filter((m) => getStatus(m) === "Resolved").length;

  const statCards = [
    { label: "Total Messages", value: messages.length, icon: <MailOutlineIcon />, color: "#3b82f6", bg: "rgba(59,130,246,0.08)" },
    { label: "Open / Pending", value: openCount, icon: <MarkEmailUnreadIcon />, color: "#dc2626", bg: "rgba(220,38,38,0.08)" },
    { label: "In Progress", value: inProgressCount, icon: <HourglassEmptyRoundedIcon />, color: "#c2410c", bg: "rgba(234,88,12,0.08)" },
    { label: "Resolved", value: resolvedCount, icon: <CheckCircleOutlineRoundedIcon />, color: "#15803d", bg: "rgba(21,128,61,0.08)" },
  ];

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8fafc" }}>
      <AdminSidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
          p: { xs: 3, md: 5 },
        }}
      >
        {/* HEADER */}
        <Box mb={4}>
          <Typography variant="h4" fontWeight={800} sx={{ color: "#0f172a", letterSpacing: "-0.5px" }}>
            Customer Messages
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5 }}>
            Complaints and support requests submitted by customers on their orders.
          </Typography>
        </Box>

        {/* STATS */}
        <Grid container spacing={3} mb={4}>
          {statCards.map((stat) => (
            <Grid item xs={12} sm={6} md={3} key={stat.label}>
              <Card sx={{ borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.01)" }}>
                <CardContent sx={{ p: 3, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Box>
                    <Typography variant="caption" fontWeight={600} sx={{ color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      {stat.label}
                    </Typography>
                    <Typography variant="h5" fontWeight={800} sx={{ color: "#1e293b", mt: 0.5, lineHeight: 1 }}>
                      {stat.value}
                    </Typography>
                  </Box>
                  <Box sx={{ p: 1.5, borderRadius: "12px", color: stat.color, bgcolor: stat.bg, display: "flex" }}>
                    {stat.icon}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* SEARCH */}
        <Paper elevation={0} sx={{ p: 2.5, borderRadius: "16px", mb: 4, border: "1px solid #e2e8f0", bgcolor: "#fff" }}>
          <TextField
            fullWidth
            placeholder="Search by ID, Customer, Email, Subject or Message..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#94a3b8" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                bgcolor: "#f8fafc",
                "& fieldset": { borderColor: "#e2e8f0" },
              },
            }}
          />
        </Paper>

        {/* LOADING */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
            <CircularProgress sx={{ color: "#3b82f6" }} />
          </Box>
        )}

        {/* EMPTY STATE */}
        {!loading && filteredMessages.length === 0 && (
          <Paper
            elevation={0}
            sx={{ borderRadius: "16px", border: "1px solid #e2e8f0", bgcolor: "#fff", p: 8, textAlign: "center" }}
          >
            <MailOutlineIcon sx={{ fontSize: 48, color: "#cbd5e1", mb: 1 }} />
            <Typography variant="subtitle1" fontWeight={700} sx={{ color: "#334155" }}>
              No messages
            </Typography>
            <Typography variant="body2" sx={{ color: "#94a3b8" }}>
              Customer complaints and support requests will show up here.
            </Typography>
          </Paper>
        )}

        {/* MESSAGE CARDS */}
        {!loading &&
          filteredMessages.map((message) => {
            const msgId = message.id || message.complaint_id;
            const currentStatus = getStatus(message);
            const customerName = message.consignee_name || message.name || "Unknown customer";

            return (
              <Paper
                key={msgId}
                elevation={0}
                sx={{
                  borderRadius: "16px",
                  border: "1px solid #e2e8f0",
                  bgcolor: "#fff",
                  mb: 2.5,
                  p: 3,
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 1.5, mb: 2 }}>
                  <Box>
                    <Typography variant="caption" fontWeight={700} sx={{ color: "#94a3b8", letterSpacing: "0.5px" }}>
                      MSG #{msgId} ·{" "}
                      {message.created_at
                        ? new Date(message.created_at).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "—"}
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.7, mt: 0.3 }}>
                      <PersonOutlineRoundedIcon sx={{ fontSize: 16, color: "#64748b" }} />
                      <Typography variant="body2" fontWeight={700} sx={{ color: "#1e293b" }}>
                        {customerName}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                        {message.email}
                      </Typography>
                    </Box>

                    {message.subject && (
                      <Typography variant="subtitle2" fontWeight={700} sx={{ color: "#1e293b", mt: 1 }}>
                        {message.subject}
                      </Typography>
                    )}
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {/* SINGLE STATUS ACTION BUTTON */}
                    <Button
                      size="small"
                      onClick={() => handleToggleStatus(message)}
                      disabled={updatingId === msgId}
                      sx={{
                        textTransform: "none",
                        fontWeight: 700,
                        fontSize: "0.78rem",
                        borderRadius: "8px",
                        px: 1.5,
                        minWidth: 100,
                        ...statusStyle(currentStatus),
                      }}
                    >
                      {updatingId === msgId ? (
                        <CircularProgress size={14} sx={{ color: "inherit" }} />
                      ) : (
                        currentStatus
                      )}
                    </Button>

                    <IconButton
                      size="small"
                      onClick={() => setDeleteTarget(message)}
                      disabled={updatingId === msgId}
                      sx={{
                        color: "#94a3b8",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        "&:hover": { color: "#dc2626", bgcolor: "rgba(220,38,38,0.06)", borderColor: "rgba(220,38,38,0.3)" },
                      }}
                    >
                      <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Box>
                </Box>

                <Typography variant="body2" sx={{ color: "#475569", lineHeight: 1.6 }}>
                  {message.message}
                </Typography>
              </Paper>
            );
          })}
      </Box>

      {/* DELETE CONFIRM */}
      <Dialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: "16px", border: "1px solid #e2e8f0" } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: "#0f172a" }}>Delete this message?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: "#64748b" }}>
            This permanently removes the message submitted by {deleteTarget?.name || deleteTarget?.consignee_name || "this customer"}. This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setDeleteTarget(null)} sx={{ textTransform: "none", fontWeight: 700, color: "#64748b" }}>
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              borderRadius: "10px",
              px: 2.5,
              color: "#fff",
              bgcolor: "#dc2626",
              "&:hover": { bgcolor: "#b91c1c" },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}