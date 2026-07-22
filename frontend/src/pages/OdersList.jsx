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
  Chip,
  Paper,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/SearchOutlined";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLongOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import PaymentsIcon from "@mui/icons-material/PaymentsOutlined";
import LocalShippingIcon from "@mui/icons-material/LocalShippingOutlined";

import AdminSidebar from "../components/AdminNavbar";

const SIDEBAR_WIDTH = 260;
const API_URL = "http://localhost:5000/api/orders/all";

export default function OrderDashboard() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  // Shipping details popup state
  const [shipDialogOrder, setShipDialogOrder] = useState(null);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [shippingRef, setShippingRef] = useState("");
  const [deliveredDate, setDeliveredDate] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(API_URL);

      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error("Fetch Orders Error:", err);
    }
  };

  const openShipDialog = (order) => {
    setShipDialogOrder(order);
    setTrackingNumber(order.tracking_number || "");
    setShippingRef(order.shipping_ref || "");
    setDeliveredDate(order.delivered_date || "");
  };

  const closeShipDialog = () => {
    setShipDialogOrder(null);
    setTrackingNumber("");
    setShippingRef("");
    setDeliveredDate("");
  };

  const handleConfirmShipped = async () => {
    if (!shipDialogOrder) return;
    const order = shipDialogOrder;

    try {
      setUpdatingId(order.order_id);

      const res = await axios.put(
        `http://localhost:5000/api/orders/update-status/${order.order_id}`,
        {
          shipping_status: "Shipped",
          tracking_number: trackingNumber,
          shipping_ref: shippingRef,
          delivered_date: deliveredDate,
        }
      );

      if (res.data.success) {
        setOrders((prev) =>
          prev.map((o) =>
            o.order_id === order.order_id
              ? {
                  ...o,
                  shipping_status: "Shipped",
                  tracking_number: trackingNumber,
                  shipping_ref: shippingRef,
                  delivered_date: deliveredDate,
                }
              : o
          )
        );
        closeShipDialog();
      }
    } catch (err) {
      console.error("Mark Shipped Error:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const searchValue = search.toLowerCase();

    return (
      String(order.order_id).toLowerCase().includes(searchValue) ||
      order.consignee_name?.toLowerCase().includes(searchValue) ||
      order.email?.toLowerCase().includes(searchValue) ||
      order.phone?.toLowerCase().includes(searchValue) ||
      order.city?.toLowerCase().includes(searchValue) ||
      order.shipping_status?.toLowerCase().includes(searchValue)
    );
  });

  const totalOrders = orders.length;

  const totalRevenue = orders.reduce(
    (total, order) => total + Number(order.total_amount || 0),
    0
  );

  const codOrders = orders.filter(
    (order) => order.payment_method?.toLowerCase() === "cod"
  ).length;

  const onlineOrders = orders.filter(
    (order) => order.payment_method?.toLowerCase() !== "cod"
  ).length;

  const getShippingStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "processing":
        return { bgcolor: "#fff7ed", color: "#c2410c", border: "1px solid #fed7aa" };
      case "shipped":
        return { bgcolor: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe" };
      case "delivered":
        return { bgcolor: "#f0fdf4", color: "#15803d", border: "1px solid #dcfce7" };
      case "cancelled":
        return { bgcolor: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" };
      default:
        return { bgcolor: "#f8fafc", color: "#475569", border: "1px solid #e2e8f0" };
    }
  };

  const statCards = [
    {
      label: "Total Orders",
      value: totalOrders,
      icon: <ReceiptLongIcon />,
      color: "#3b82f6",
      bg: "rgba(59, 130, 246, 0.08)",
    },
    {
      label: "Total Revenue",
      value: `Rs. ${totalRevenue.toLocaleString()}`,
      icon: <PaymentsIcon />,
      color: "#22c55e",
      bg: "rgba(34, 197, 94, 0.08)",
    },
    {
      label: "COD Orders",
      value: codOrders,
      icon: <LocalShippingIcon />,
      color: "#eab308",
      bg: "rgba(234, 179, 8, 0.08)",
    },
    {
      label: "Online Payments",
      value: onlineOrders,
      icon: <CheckCircleIcon />,
      color: "#8b5cf6",
      bg: "rgba(139, 92, 246, 0.08)",
    },
  ];

  const columns = [
    "Order ID",
    "Customer",
    "Contact",
    "Delivery Address",
    "Payment",
    "Total",
    "Shipping Status",
    "Actions",
  ];

  const gridTemplateColumns = "0.6fr 1.5fr 1.5fr 1.5fr 1fr 1fr 1fr 1fr";

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8fafc" }}>
      <AdminSidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
          p: { xs: 3, md: 5 },
          transition: "all 0.2s ease-in-out",
        }}
      >
        {/* HEADER */}
        <Box mb={4}>
          <Typography variant="h4" fontWeight={800} sx={{ color: "#0f172a", letterSpacing: "-0.5px" }}>
            Orders List Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5 }}>
            Manage all AgroTech customer orders in real-time
          </Typography>
        </Box>

        {/* STATISTICS */}
        <Grid container spacing={3} mb={4}>
          {statCards.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={stat.label}>
              <Card
                sx={{
                  borderRadius: "16px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.01)",
                }}
              >
                <CardContent
                  sx={{ p: 3, display: "flex", alignItems: "center", justifyContent: "space-between" }}
                >
                  <Box>
                    <Typography
                      variant="caption"
                      fontWeight={600}
                      sx={{ color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}
                    >
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
        <Paper
          elevation={0}
          sx={{ p: 2.5, borderRadius: "16px", mb: 4, border: "1px solid #e2e8f0", bgcolor: "#fff" }}
        >
          <TextField
            fullWidth
            placeholder="Search by Order ID, Customer, Email, Phone, City or Status..."
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

        {/* ORDERS TABLE */}
        <Paper
          elevation={0}
          sx={{ borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "auto", bgcolor: "#fff" }}
        >
          {/* TABLE HEADER */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns,
              gap: 2,
              p: 2.5,
              bgcolor: "#f8fafc",
              borderBottom: "1px solid #e2e8f0",
              width: "100%",
            }}
          >
            {columns.map((col) => (
              <Typography
                key={col}
                variant="caption"
                fontWeight={700}
                sx={{ color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}
              >
                {col}
              </Typography>
            ))}
          </Box>

          {/* TABLE ROWS */}
          {filteredOrders.map((order) => (
            <Box
              key={order.order_id}
              sx={{
                display: "grid",
                gridTemplateColumns,
                gap: 2,
                p: 2.5,
                borderBottom: "1px solid #f1f5f9",
                alignItems: "center",
                width: "100%",
                transition: "background 0.2s ease",
                "&:hover": { bgcolor: "#f8fafc" },
              }}
            >
              {/* ORDER ID */}
              <Typography variant="body2" fontWeight={700} sx={{ color: "#3b82f6" }}>
                #{order.order_id}
              </Typography>

              {/* CUSTOMER */}
              <Box>
                <Typography variant="body2" fontWeight={700} sx={{ color: "#1e293b" }}>
                  {order.consignee_name}
                </Typography>
                <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                  Customer
                </Typography>
              </Box>

              {/* CONTACT */}
              <Box>
                <Typography variant="body2" sx={{ color: "#475569" }}>
                  {order.email}
                </Typography>
                <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                  {order.phone}
                </Typography>
              </Box>

              {/* ADDRESS */}
              <Box>
                <Typography variant="body2" sx={{ color: "#475569" }}>
                  {order.address}
                </Typography>
                <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                  {order.city} - {order.postal_code}
                </Typography>
              </Box>

              {/* PAYMENT */}
              <Chip
                label={order.payment_method}
                size="small"
                sx={{
                  width: "fit-content",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  bgcolor: "#f0fdf4",
                  color: "#15803d",
                  border: "1px solid #dcfce7",
                }}
              />

              {/* TOTAL */}
              <Typography variant="body2" fontWeight={800} sx={{ color: "#16a34a" }}>
                Rs. {Number(order.total_amount).toLocaleString()}
              </Typography>

              {/* SHIPPING STATUS */}
              <Chip
                label={order.shipping_status || "Processing"}
                size="small"
                sx={{
                  width: "fit-content",
                  fontWeight: 700,
                  textTransform: "capitalize",
                  ...getShippingStatusStyle(order.shipping_status),
                }}
              />

              {/* ACTIONS */}
              <Box>
                {["shipped", "delivered", "cancelled"].includes(
                  order.shipping_status?.toLowerCase()
                ) ? (
                  <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                    —
                  </Typography>
                ) : (
                  <Button
                    size="small"
                    onClick={() => openShipDialog(order)}
                    startIcon={<LocalShippingIcon sx={{ fontSize: 16 }} />}
                    sx={{
                      textTransform: "none",
                      fontWeight: 700,
                      fontSize: "0.78rem",
                      borderRadius: "8px",
                      px: 1.5,
                      color: "#1d4ed8",
                      border: "1px solid #bfdbfe",
                      bgcolor: "#eff6ff",
                      "&:hover": { bgcolor: "#dbeafe", borderColor: "#93c5fd" },
                    }}
                  >
                    Shipped
                  </Button>
                )}
              </Box>
            </Box>
          ))}

          {/* EMPTY STATE */}
          {filteredOrders.length === 0 && (
            <Box sx={{ p: 8, textAlign: "center" }}>
              <ReceiptLongIcon sx={{ fontSize: 50, color: "#cbd5e1", mb: 1 }} />
              <Typography variant="subtitle1" color="text.secondary" fontWeight={600}>
                No orders found
              </Typography>
              <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                Try adjusting your search keywords.
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>

      {/* SHIP ORDER — TRACKING DETAILS POPUP */}
      <Dialog
        open={Boolean(shipDialogOrder)}
        onClose={closeShipDialog}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 20px 25px -5px rgba(0,0,0,0.08)",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: "#0f172a" }}>
          Mark Order #{shipDialogOrder?.order_id} as Shipped
        </DialogTitle>

        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 0.5 }}>
            <TextField
              label="Tracking Number"
              placeholder="e.g. LK123456789"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  "& fieldset": { borderColor: "#e2e8f0" },
                },
              }}
            />

            <TextField
              label="Shipping Reference"
              placeholder="e.g. Waybill / courier ref"
              value={shippingRef}
              onChange={(e) => setShippingRef(e.target.value)}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  "& fieldset": { borderColor: "#e2e8f0" },
                },
              }}
            />

            <TextField
              label="Expected Delivery Date"
              type="date"
              value={deliveredDate}
              onChange={(e) => setDeliveredDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  "& fieldset": { borderColor: "#e2e8f0" },
                },
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            onClick={closeShipDialog}
            sx={{ textTransform: "none", fontWeight: 700, color: "#64748b" }}
          >
            Cancel
          </Button>

          <Button
            onClick={handleConfirmShipped}
            disabled={
              !trackingNumber.trim() ||
              !shippingRef.trim() ||
              !deliveredDate ||
              updatingId === shipDialogOrder?.order_id
            }
            startIcon={
              updatingId === shipDialogOrder?.order_id ? (
                <CircularProgress size={14} sx={{ color: "#fff" }} />
              ) : null
            }
            sx={{
              textTransform: "none",
              fontWeight: 700,
              borderRadius: "10px",
              px: 2.5,
              color: "#fff",
              bgcolor: "#1d4ed8",
              "&:hover": { bgcolor: "#1e40af" },
              "&.Mui-disabled": { bgcolor: "#e2e8f0", color: "#94a3b8" },
            }}
          >
            Confirm Shipped
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}