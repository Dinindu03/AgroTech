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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Backdrop,
  Fade,
  IconButton,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/SearchOutlined";
import Inventory2Icon from "@mui/icons-material/Inventory2Outlined";
import HourglassEmptyRoundedIcon from "@mui/icons-material/HourglassEmptyRounded";
import LocalShippingIcon from "@mui/icons-material/LocalShippingOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import AdminSidebar from "../components/AdminNavbar";

const SIDEBAR_WIDTH = 260;
const API_URL = "http://localhost:5000/api/orders/P";


const NOTIFICATION_DURATION = 5000;

// ── Helpers ──────────────────────────────────────────────────

// Formats a Date object into the value shape <input type="date"> expects: YYYY-MM-DD
function toDateInputValue(date) {
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 10);
}

// Formats a Date object into the value shape <input type="time"> expects: HH:MM
function toTimeInputValue(date) {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}


function getLoggedInUser() {
  try {
    const directName =
      localStorage.getItem("adminName") ||
      localStorage.getItem("userName") ||
      localStorage.getItem("name");
    if (directName) return directName;

    const userObjRaw = localStorage.getItem("user") || localStorage.getItem("adminUser");
    if (userObjRaw) {
      const parsed = JSON.parse(userObjRaw);
      return parsed?.name || parsed?.username || parsed?.email || "";
    }

    const token = localStorage.getItem("token");
    if (token && token.split(".").length === 3) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload?.name || payload?.username || payload?.email || "";
    }
  } catch (err) {
    console.error("Could not resolve logged-in user:", err);
  }
  return "";
}

export default function PackingDepartment() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Confirm-packing dialog state
  const [confirmOrder, setConfirmOrder] = useState(null); // order currently being confirmed, or null
  const [packedDate, setPackedDate] = useState("");
  const [packedTime, setPackedTime] = useState("");
  const [packedBy, setPackedBy] = useState("");

  // Result popup (shown after the confirm action resolves, success or failure)
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
      }
    } catch (err) {
      console.error("Fetch Orders Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Packing department only cares about orders that haven't shipped yet
  const packingQueue = orders.filter((order) => {
    const status = order.shipping_status?.toLowerCase() || "processing";
    return status === "processing";
  });

  const filteredQueue = packingQueue.filter((order) => {
    const searchValue = search.toLowerCase();
    return (
      String(order.order_id).toLowerCase().includes(searchValue) ||
      order.consignee_name?.toLowerCase().includes(searchValue) ||
      order.city?.toLowerCase().includes(searchValue) ||
      order.items?.some((item) =>
        item.product_name?.toLowerCase().includes(searchValue)
      )
    );
  });

  // Opens the confirm dialog, pre-filled with the current date/time and logged-in user
  const openConfirmDialog = (order) => {
    const now = new Date();
    setPackedDate(toDateInputValue(now));
    setPackedTime(toTimeInputValue(now));
    setPackedBy(getLoggedInUser());
    setConfirmOrder(order);
  };

  const closeConfirmDialog = () => {
    setConfirmOrder(null);
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

  const handleConfirmPacked = async () => {
    if (!confirmOrder) return;
    const order = confirmOrder;

    try {
      setUpdatingId(order.order_id);

      const response = await axios.put(
        `http://localhost:5000/api/orders/update-status/${order.order_id}`,
        {
          shipping_status: "Packed",
          packed_date: packedDate,
          packed_time: packedTime,
          packed_by: packedBy,
        }
      );

      if (response.data.success) {
        setOrders((prevOrders) =>
          prevOrders.map((item) =>
            item.order_id === order.order_id
              ? {
                  ...item,
                  shipping_status: "Packed",
                  packed_date: packedDate,
                  packed_time: packedTime,
                  packed_by: packedBy,
                }
              : item
          )
        );
        closeConfirmDialog();
        showNotification(
          "success",
          "Order Packed",
          `Order #${order.order_id} is packed and on its way to shipping.`
        );
      } else {
        showNotification(
          "error",
          "Update Failed",
          response.data.message || `Order #${order.order_id} could not be marked as packed.`
        );
      }
    } catch (error) {
      console.error(
        "Update Shipping Status Error:",
        error.response?.data || error.message
      );
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
                bgcolor: "rgba(234, 179, 8, 0.1)",
                color: "#b45309",
                display: "flex",
              }}
            >
              <Inventory2Icon sx={{ fontSize: 22 }} />
            </Box>
            <Typography variant="h4" fontWeight={800} sx={{ color: "#0f172a", letterSpacing: "-0.5px" }}>
              Packing Department
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: "#64748b", ml: 6.2 }}>
            Pack each order's items, then confirm it's ready to hand off to shipping.
          </Typography>
        </Box>

        {/* SUMMARY */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.01)" }}>
              <CardContent sx={{ p: 3, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="caption" fontWeight={600} sx={{ color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Awaiting Packing
                  </Typography>
                  <Typography variant="h5" fontWeight={800} sx={{ color: "#1e293b", mt: 0.5, lineHeight: 1 }}>
                    {packingQueue.length}
                  </Typography>
                </Box>
                <Box sx={{ p: 1.5, borderRadius: "12px", color: "#eab308", bgcolor: "rgba(234, 179, 8, 0.08)", display: "flex" }}>
                  <HourglassEmptyRoundedIcon />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* SEARCH */}
        <Paper elevation={0} sx={{ p: 2.5, borderRadius: "16px", mb: 4, border: "1px solid #e2e8f0", bgcolor: "#fff" }}>
          <TextField
            fullWidth
            placeholder="Search by Order ID, Customer, City or Item name..."
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
            <CircularProgress sx={{ color: "#eab308" }} />
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
              Nothing waiting to be packed
            </Typography>
            <Typography variant="body2" sx={{ color: "#94a3b8" }}>
              New orders will show up here as soon as they come in.
            </Typography>
          </Paper>
        )}

        {/* ORDER CARDS */}
        {!loading &&
          filteredQueue.map((order) => (
            <PackingOrderCard
              key={order.order_id}
              order={order}
              isUpdating={updatingId === order.order_id}
              onConfirmPacked={() => openConfirmDialog(order)}
            />
          ))}
      </Box>

      {/* CONFIRM PACKING DIALOG */}
      <Dialog
        open={Boolean(confirmOrder)}
        onClose={closeConfirmDialog}
        fullWidth
        maxWidth="xs"
        PaperProps={{ sx: { borderRadius: "16px" } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: "#0f172a" }}>
          Confirm Packing — Order #{confirmOrder?.order_id}
        </DialogTitle>

        <DialogContent>
          <Typography variant="body2" sx={{ color: "#64748b", mb: 2.5 }}>
            Review the date, time and packer name below, then confirm to move this order to shipping.
          </Typography>

          <Stack spacing={2}>
            <TextField
              label="Packed Date"
              type="date"
              fullWidth
              value={packedDate}
              onChange={(e) => setPackedDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EventOutlinedIcon sx={{ fontSize: 18, color: "#94a3b8" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  bgcolor: "#f8fafc",
                },
              }}
            />

            <TextField
              label="Packed Time"
              type="time"
              fullWidth
              value={packedTime}
              onChange={(e) => setPackedTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  bgcolor: "#f8fafc",
                },
              }}
            />

            <TextField
              label="Packed By"
              fullWidth
              value={packedBy}
              onChange={(e) => setPackedBy(e.target.value)}
              placeholder="Staff name"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineRoundedIcon sx={{ fontSize: 18, color: "#94a3b8" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  bgcolor: "#f8fafc",
                },
              }}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            onClick={closeConfirmDialog}
            sx={{ textTransform: "none", fontWeight: 700, color: "#64748b" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmPacked}
            disabled={updatingId === confirmOrder?.order_id || !packedDate || !packedTime || !packedBy}
            startIcon={
              updatingId === confirmOrder?.order_id ? (
                <CircularProgress size={16} sx={{ color: "#fff" }} />
              ) : (
                <LocalShippingIcon sx={{ fontSize: 18 }} />
              )
            }
            sx={{
              textTransform: "none",
              fontWeight: 700,
              borderRadius: "10px",
              px: 3,
              color: "#fff",
              bgcolor: "#16a34a",
              "&:hover": { bgcolor: "#15803d" },
              "&.Mui-disabled": { bgcolor: "#e2e8f0", color: "#94a3b8" },
            }}
          >
            Confirm & Ship
          </Button>
        </DialogActions>
      </Dialog>

      {/* RESULT POPUP — shows after Confirm & Ship resolves, centered, auto-dismisses */}
      <ResultPopup notification={notification} onClose={closeNotification} />
    </Box>
  );
}

// ── Result popup ─────────────────────────────────────────────
// Centered, self-dismissing confirmation card. Shows success (green) or
// error (red) styling depending on how the update request resolved.

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
              color: isSuccess ? "#16a34a" : "#dc2626",
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
              bgcolor: isSuccess ? "#16a34a" : "#dc2626",
              "&:hover": { bgcolor: isSuccess ? "#15803d" : "#b91c1c" },
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
              bgcolor: isSuccess ? "#16a34a" : "#dc2626",
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

// ── Order card ───────────────────────────────────────────────

function PackingOrderCard({ order, isUpdating, onConfirmPacked }) {
  const itemCount = order.items?.reduce((sum, item) => sum + Number(item.quantity || 0), 0) || 0;

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: "16px",
        border: "1px solid #8ec0b4",
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
          bgcolor: "#e8fbec",
          borderBottom: "1px solid #e2f0e6",
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
              {order.shipping_address}, {order.shipping_city}
            </Typography>
          </Box>
        </Box>

        <Chip
          label="Awaiting Packing"
          size="small"
          sx={{
            fontWeight: 700,
            bgcolor: "#fff7ed",
            color: "#c2410c",
            border: "1px solid #fed7aa",
          }}
        />
      </Box>

      {/* ITEMS */}
      <Box sx={{ p: 3 }}>
        <Typography
          variant="caption"
          fontWeight={700}
          sx={{ color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}
        >
          Items to pack ({itemCount})
        </Typography>

        <List disablePadding sx={{ mt: 1.5 }}>
          {order.items?.map((item, i) => (
            <ListItem
              key={`${order.order_id}-${item.product_id}-${i}`}
              disableGutters
              sx={{
                py: 1.2,
                px: 2,
                mb: 1,
                borderRadius: "10px",
                bgcolor: "#f8fafc",
                border: "1px solid #f1f5f9",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
             <Box>
                <Typography
                  variant="body2"
                  fontWeight={700}
                  sx={{ color: "#1e293b" }}
                >
                  {item.product_name}
                </Typography>

                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    color: "#64748b",
                    fontWeight: 600,
                    mt: 0.3,
                  }}
                >
                  Product Code: {item.product_id}
                </Typography>

                {item.price != null && (
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      color: "#16a34a",
                      fontWeight: 700,
                      mt: 0.3,
                    }}
                  >
                    Rs. {Number(item.price).toFixed(2)}
                  </Typography>
                )}
              </Box>

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

      {/* ACTION */}
      <Box sx={{ p: 3, display: "flex", justifyContent: "flex-end" }}>
        <Button
          onClick={onConfirmPacked}
          disabled={isUpdating}
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
            bgcolor: "#16a34a",
            "&:hover": { bgcolor: "#15803d" },
            "&.Mui-disabled": { bgcolor: "#e2e8f0", color: "#94a3b8" },
          }}
        >
          Packing Complete — Ready to Ship
        </Button>
      </Box>
    </Paper>
  );
}