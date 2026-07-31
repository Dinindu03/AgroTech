import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  Chip,
  Paper,
  Divider,
  List,
  ListItem,
  Button,
  CircularProgress,
  Backdrop,
  Fade,
  IconButton,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/SearchOutlined";
import LocalShippingIcon from "@mui/icons-material/LocalShippingOutlined";
import Inventory2Icon from "@mui/icons-material/Inventory2Outlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import AdminSidebar from "../components/AdminNavbar";

const SIDEBAR_WIDTH = 260;
const API_URL = "http://localhost:5000/api/orders/S";
const NOTIFICATION_DURATION = 5000;

export default function ShippingDepartment() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // Per-order form values, keyed by order_id
  const [formValues, setFormValues] = useState({});

  // Result popup state (exact same as PackingDepartment)
  const [notification, setNotification] = useState(null); // { type: 'success' | 'error', title, message } | null
  const notificationTimerRef = useRef(null);

  useEffect(() => {
    fetchOrders();
    return () => {
      if (notificationTimerRef.current) clearTimeout(notificationTimerRef.current);
    };
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);

      if (res.data.success) {
        setOrders(res.data.orders);

        // Seed the form fields from whatever the order already has
        const seeded = {};
        res.data.orders.forEach((order) => {
          seeded[order.order_id] = {
            tracking_number: order.tracking_number || "",
            shipping_ref: order.shipping_ref || "",
            shipping_date: order.shipping_date
              ? String(order.shipping_date).slice(0, 10)
              : new Date().toISOString().slice(0, 10),
          };
        });
        setFormValues(seeded);
      }
    } catch (err) {
      console.error("Fetch Orders Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Shows the centered result popup and schedules its auto-dismiss
  const showNotification = (type, title, message) => {
    if (notificationTimerRef.current) clearTimeout(notificationTimerRef.current);
    setNotification({ type, title, message });
    notificationTimerRef.current = setTimeout(() => {
      setNotification(null);
    }, NOTIFICATION_DURATION);
  };

  const closeNotification = () => {
    if (notificationTimerRef.current) clearTimeout(notificationTimerRef.current);
    setNotification(null);
  };

  const shippingQueue = orders.filter((order) => {
    const status = order.shipping_status?.toLowerCase();
    return status === "packed" || status === "ready to ship" || status === "processing";
  });

  const filteredQueue = shippingQueue.filter((order) => {
    const searchValue = search.toLowerCase();
    return (
      String(order.order_id).toLowerCase().includes(searchValue) ||
      order.consignee_name?.toLowerCase().includes(searchValue) ||
      order.city?.toLowerCase().includes(searchValue)
    );
  });

  const handleFieldChange = (orderId, field, value) => {
    setFormValues((prev) => ({
      ...prev,
      [orderId]: { ...prev[orderId], [field]: value },
    }));
  };

  const handleConfirmShipped = async (order) => {
    const values = formValues[order.order_id] || {};

    if (!values.tracking_number?.trim() || !values.shipping_ref?.trim() || !values.shipping_date) {
      showNotification("error", "Missing Information", "Please fill in all dispatch details before confirming.");
      return;
    }

    try {
      setUpdatingId(order.order_id);

      const res = await axios.put(
        `http://localhost:5000/api/orders/update-status-shiped/${order.order_id}`,
        {
          shipping_status: "Shipped",
          tracking_number: values.tracking_number,
          shipping_ref: values.shipping_ref,
          shipping_date: values.shipping_date,
        }
      );

      if (res.data.success) {
        setOrders((prev) =>
          prev.map((o) =>
            o.order_id === order.order_id
              ? {
                  ...o,
                  shipping_status: "Shipped",
                  tracking_number: values.tracking_number,
                  shipping_ref: values.shipping_ref,
                  shipping_date: values.shipping_date,
                }
              : o
          )
        );

        showNotification(
          "success",
          "Order Shipped",
          `Order #${order.order_id} has been marked as shipped successfully.`
        );
      } else {
        showNotification(
          "error",
          "Update Failed",
          res.data.message || `Order #${order.order_id} could not be marked as shipped.`
        );
      }
    } catch (error) {
      console.error("Update Shipping Status Error:", error.response?.data || error.message);
      showNotification(
        "error",
        "Update Failed",
        error.response?.data?.message ||
          `Something went wrong while updating order #${order.order_id}. Please try again.`
      );
    } finally {
      setUpdatingId(null);
    }
  };

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
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
            <Box
              sx={{
                p: 1,
                borderRadius: "10px",
                bgcolor: "rgba(29, 78, 216, 0.1)",
                color: "#1d4ed8",
                display: "flex",
              }}
            >
              <LocalShippingIcon sx={{ fontSize: 22 }} />
            </Box>
            <Typography variant="h4" fontWeight={800} sx={{ color: "#0f172a", letterSpacing: "-0.5px" }}>
              Shipping Department
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: "#64748b", ml: 6.2 }}>
            Hand packed orders to the courier, log the tracking details, and confirm dispatch.
          </Typography>
        </Box>

        {/* SUMMARY */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.01)" }}>
              <CardContent sx={{ p: 3, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="caption" fontWeight={600} sx={{ color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Ready to Ship
                  </Typography>
                  <Typography variant="h5" fontWeight={800} sx={{ color: "#1e293b", mt: 0.5, lineHeight: 1 }}>
                    {shippingQueue.length}
                  </Typography>
                </Box>
                <Box sx={{ p: 1.5, borderRadius: "12px", color: "#1d4ed8", bgcolor: "rgba(29, 78, 216, 0.08)", display: "flex" }}>
                  <Inventory2Icon />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* SEARCH */}
        <Paper elevation={0} sx={{ p: 2.5, borderRadius: "16px", mb: 4, border: "1px solid #e2e8f0", bgcolor: "#fff" }}>
          <TextField
            fullWidth
            placeholder="Search by Order ID, Customer or City..."
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
            <CircularProgress sx={{ color: "#1d4ed8" }} />
          </Box>
        )}

        {/* EMPTY STATE */}
        {!loading && filteredQueue.length === 0 && (
          <Paper
            elevation={0}
            sx={{ borderRadius: "16px", border: "1px solid #e2e8f0", bgcolor: "#fff", p: 8, textAlign: "center" }}
          >
            <CheckCircleIcon sx={{ fontSize: 48, color: "#cbd5e1", mb: 1 }} />
            <Typography variant="subtitle1" fontWeight={700} sx={{ color: "#334155" }}>
              Nothing waiting to ship
            </Typography>
            <Typography variant="body2" sx={{ color: "#94a3b8" }}>
              Orders show up here once the packing department marks them ready.
            </Typography>
          </Paper>
        )}

        {/* ORDER CARDS */}
        {!loading &&
          filteredQueue.map((order) => (
            <ShippingOrderCard
              key={order.order_id}
              order={order}
              values={formValues[order.order_id] || {}}
              isUpdating={updatingId === order.order_id}
              onFieldChange={(field, value) => handleFieldChange(order.order_id, field, value)}
              onConfirmShipped={() => handleConfirmShipped(order)}
            />
          ))}
      </Box>

      {/* RESULT POPUP — Centered overlay, auto-dismisses after 5s */}
      <ResultPopup notification={notification} onClose={closeNotification} />
    </Box>
  );
}

// ── Result Popup Sub-Component ────────────────────────────────
// Centered modal popup card. Displays green check for success or red error icon, 
// includes backdrop blur, pop animation, and auto-dismiss progress bar.

function ResultPopup({ notification, onClose }) {
  const isSuccess = notification?.type === "success";

  return (
    <Backdrop
      open={Boolean(notification)}
      onClick={onClose}
      sx={{
        zIndex: (theme) => theme.zIndex.modal + 1,
        bgcolor: "rgba(15, 23, 42, 0.45)",
        backdropFilter: "blur(2px)",
      }}
    >
      <Fade in={Boolean(notification)} timeout={{ enter: 300, exit: 200 }}>
        <Paper
          onClick={(e) => e.stopPropagation()}
          elevation={0}
          sx={{
            position: "relative",
            width: 360,
            maxWidth: "90vw",
            borderRadius: "20px",
            bgcolor: "#fff",
            border: "1px solid #e2e8f0",
            boxShadow: "0 20px 40px -12px rgba(15, 23, 42, 0.35)",
            overflow: "hidden",
            textAlign: "center",
            px: 4,
            pt: 5,
            pb: 3.5,
            "@keyframes popIn": {
              "0%": { transform: "scale(0.85)", opacity: 0 },
              "60%": { transform: "scale(1.03)", opacity: 1 },
              "100%": { transform: "scale(1)", opacity: 1 },
            },
            animation: "popIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          <IconButton
            onClick={onClose}
            size="small"
            sx={{ position: "absolute", top: 10, right: 10, color: "#94a3b8" }}
          >
            <CloseRoundedIcon fontSize="small" />
          </IconButton>

          <Box
            sx={{
              width: 68,
              height: 68,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 2,
              bgcolor: isSuccess ? "rgba(22, 163, 74, 0.1)" : "rgba(220, 38, 38, 0.1)",
              color: isSuccess ? "#1d4ed8" : "#dc2626",
            }}
          >
            {isSuccess ? (
              <CheckCircleIcon sx={{ fontSize: 38 }} />
            ) : (
              <ErrorOutlineRoundedIcon sx={{ fontSize: 38 }} />
            )}
          </Box>

          <Typography variant="h6" fontWeight={800} sx={{ color: "#0f172a", mb: 0.75 }}>
            {notification?.title}
          </Typography>

          <Typography variant="body2" sx={{ color: "#64748b", mb: 3, px: 1 }}>
            {notification?.message}
          </Typography>

          <Button
            onClick={onClose}
            fullWidth
            sx={{
              textTransform: "none",
              fontWeight: 700,
              borderRadius: "10px",
              py: 1,
              color: "#fff",
              bgcolor: isSuccess ? "#1d4ed8" : "#dc2626",
              "&:hover": { bgcolor: isSuccess ? "#1d4ed8" : "#b91c1c" },
            }}
          >
            Got it
          </Button>

          {/* Auto-dismiss progress bar */}
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              height: 4,
              width: "100%",
              bgcolor: isSuccess ? "#1d4ed8" : "#dc2626",
              transformOrigin: "left",
              "@keyframes shrinkWidth": {
                from: { transform: "scaleX(1)" },
                to: { transform: "scaleX(0)" },
              },
              animation: notification ? "shrinkWidth 5s linear forwards" : "none",
            }}
          />
        </Paper>
      </Fade>
    </Backdrop>
  );
}

// ── Order Card Sub-Component ─────────────────────────────────

function ShippingOrderCard({ order, values, isUpdating, onFieldChange, onConfirmShipped }) {
  const itemCount = order.items?.reduce((sum, item) => sum + Number(item.quantity || 0), 0) || 0;

  const canConfirm =
    values.tracking_number?.trim() && values.shipping_ref?.trim() && values.shipping_date;

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: "16px",
        border: "1px solid #d3e5fb",
        bgcolor: "#ffffff",
        mb: 3,
        overflow: "hidden",
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 1.5,
          p: 3,
          bgcolor: "#cfe3f7",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <Box>
          <Typography variant="caption" fontWeight={700} sx={{ color: "#94a3b8", letterSpacing: "0.5px" }}>
            ORDER #{order.order_id}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.7, mt: 0.3 }}>
            <PersonOutlineRoundedIcon sx={{ fontSize: 17, color: "#64748b" }} />
            <Typography variant="body1" fontWeight={700} sx={{ color: "#1e293b" }}>
              {order.consignee_name}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.7, mt: 0.3 }}>
            <PlaceOutlinedIcon sx={{ fontSize: 16, color: "#94a3b8" }} />
            <Typography variant="body2" sx={{ color: "#64748b" }}>
              {order.address}, {order.city} {order.postal_code ? `- ${order.postal_code}` : ""}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.7, mt: 0.3 }}>
            <PhoneOutlinedIcon sx={{ fontSize: 16, color: "#94a3b8" }} />
            <Typography variant="body2" sx={{ color: "#64748b" }}>
              {order.phone}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1 }}>
          <Chip
            label={order.shipping_status || "Ready to Ship"}
            size="small"
            sx={{ fontWeight: 700, bgcolor: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe" }}
          />
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
            <PaymentsOutlinedIcon sx={{ fontSize: 15, color: "#94a3b8" }} />
            <Typography variant="caption" sx={{ color: "#64748b" }}>
              {order.payment_method?.toUpperCase() === "COD" ? "Cash on Delivery" : order.payment_method}
            </Typography>
          </Box>
          <Typography variant="body2" fontWeight={800} sx={{ color: "#16a34a" }}>
            Rs. {Number(order.total_amount).toLocaleString()}
          </Typography>
        </Box>
      </Box>

      {/* ITEMS */}
      <Box sx={{ p: 3 }}>
        <Typography
          variant="caption"
          fontWeight={700}
          sx={{ color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}
        >
          Items ({itemCount})
        </Typography>

        <List disablePadding sx={{ mt: 1.5 }}>
          {order.items?.map((item, i) => (
            <ListItem
              key={`${order.order_id}-${item.product_id}-${i}`}
              disableGutters
              sx={{
                py: 1,
                px: 2,
                mb: 1,
                borderRadius: "10px",
                bgcolor: "#f8fafc",
                border: "1px solid #f1f5f9",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="body2" fontWeight={700} sx={{ color: "#1e293b" }}>
                {item.product_name}
              </Typography>
              <Chip
                label={`× ${item.quantity}`}
                size="small"
                sx={{ fontWeight: 700, bgcolor: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe" }}
              />
            </ListItem>
          ))}

          {(!order.items || order.items.length === 0) && (
            <Typography variant="body2" sx={{ color: "#94a3b8", fontStyle: "italic" }}>
              No item details available for this order.
            </Typography>
          )}
        </List>
      </Box>

      <Divider sx={{ borderColor: "#e2e8f0" }} />

      {/* DISPATCH DETAILS FORM */}
      <Box sx={{ p: 3 }}>
        <Typography
          variant="caption"
          fontWeight={700}
          sx={{ color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px", mb: 1.5, display: "block" }}
        >
          Dispatch Details
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Tracking Number"
              placeholder="e.g. LK123456789"
              value={values.tracking_number || ""}
              onChange={(e) => onFieldChange("tracking_number", e.target.value)}
              fullWidth
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: "10px", "& fieldset": { borderColor: "#e2e8f0" } },
              }}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="Shipping Reference"
              placeholder="e.g. Waybill / courier ref"
              value={values.shipping_ref || ""}
              onChange={(e) => onFieldChange("shipping_ref", e.target.value)}
              fullWidth
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: "10px", "& fieldset": { borderColor: "#e2e8f0" } },
              }}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="Shipping Date"
              type="date"
              value={values.shipping_date || ""}
              onChange={(e) => onFieldChange("shipping_date", e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: "10px", "& fieldset": { borderColor: "#e2e8f0" } },
              }}
            />
          </Grid>
        </Grid>
      </Box>

      {/* ACTION BUTTON */}
      <Box sx={{ px: 3, pb: 3, display: "flex", justifyContent: "flex-end" }}>
        <Button
          onClick={onConfirmShipped}
          disabled={!canConfirm || isUpdating}
          startIcon={
            isUpdating ? (
              <CircularProgress size={16} sx={{ color: "#fff" }} />
            ) : (
              <LocalShippingIcon sx={{ fontSize: 18 }} />
            )
          }
          sx={{
            textTransform: "none",
            fontWeight: 700,
            fontSize: "0.88rem",
            borderRadius: "10px",
            px: 3,
            py: 1,
            color: "#fff",
            bgcolor: "#1d4ed8",
            "&:hover": { bgcolor: "#1e40af" },
            "&.Mui-disabled": { bgcolor: "#e2e8f0", color: "#94a3b8" },
          }}
        >
          Confirm Shipped
        </Button>
      </Box>
    </Paper>
  );
}