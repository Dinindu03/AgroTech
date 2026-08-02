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
  Tabs,
  Tab,
  CircularProgress,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/SearchOutlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";

import AdminSidebar from "../components/AdminNavbar";

const SIDEBAR_WIDTH = 260;
const DELIVERED_URL = "http://localhost:5000/api/orders/delivered";
const SHIPPED_URL = "http://localhost:5000/api/orders/shipped";

export default function ShippedAndDeliveredOrders() {
  const [tab, setTab] = useState(0); // 0 = Shipped, 1 = Delivered
  const [search, setSearch] = useState("");

  const [shippedOrders, setShippedOrders] = useState([]);
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const [shippedRes, deliveredRes] = await Promise.all([
        axios.get(SHIPPED_URL).catch(() => ({ data: { success: false, orders: [] } })),
        axios.get(DELIVERED_URL).catch(() => ({ data: { success: false, orders: [] } })),
      ]);

      if (shippedRes.data?.success) setShippedOrders(shippedRes.data.orders || []);
      if (deliveredRes.data?.success) setDeliveredOrders(deliveredRes.data.orders || []);
    } catch (err) {
      console.error("Fetch Orders Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredShipped = shippedOrders.filter((order) => {
    const s = search.toLowerCase();
    return (
      String(order.order_id).toLowerCase().includes(s) ||
      order.consignee_name?.toLowerCase().includes(s) ||
      order.city?.toLowerCase().includes(s)
    );
  });

  const filteredDelivered = deliveredOrders.filter((order) => {
    const s = search.toLowerCase();
    return (
      String(order.order_id).toLowerCase().includes(s) ||
      order.consignee_name?.toLowerCase().includes(s) ||
      order.city?.toLowerCase().includes(s)
    );
  });

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
          <Typography
            variant="h4"
            fontWeight={800}
            sx={{ color: "#0f172a", letterSpacing: "-0.5px" }}
          >
            Shipped &amp; Delivered Orders
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5 }}>
            Monitor active shipments and completed deliveries.
          </Typography>
        </Box>

        {/* SUMMARY CARDS */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: "16px", border: "1px solid #e2e8f0" }}>
              <CardContent
                sx={{
                  p: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    sx={{
                      color: "#64748b",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Shipped
                  </Typography>
                  <Typography
                    variant="h5"
                    fontWeight={800}
                    sx={{ color: "#1e293b", mt: 0.5 }}
                  >
                    {shippedOrders.length}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: "12px",
                    color: "#2563eb",
                    bgcolor: "rgba(37,99,235,0.08)",
                    display: "flex",
                  }}
                >
                  <LocalShippingOutlinedIcon />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: "16px", border: "1px solid #e2e8f0" }}>
              <CardContent
                sx={{
                  p: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    sx={{
                      color: "#64748b",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Delivered
                  </Typography>
                  <Typography
                    variant="h5"
                    fontWeight={800}
                    sx={{ color: "#1e293b", mt: 0.5 }}
                  >
                    {deliveredOrders.length}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: "12px",
                    color: "#15803d",
                    bgcolor: "rgba(21,128,61,0.08)",
                    display: "flex",
                  }}
                >
                  <CheckCircleOutlineRoundedIcon />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* TABS */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
            bgcolor: "#fff",
            mb: 3,
            px: 1,
          }}
        >
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 700,
                fontSize: "0.88rem",
                minHeight: 52,
              },
              "& .Mui-selected": { color: "#1d4ed8 !important" },
              "& .MuiTabs-indicator": { bgcolor: "#1d4ed8" },
            }}
          >
            <Tab label={`Shipped (${shippedOrders.length})`} />
            <Tab label={`Delivered (${deliveredOrders.length})`} />
          </Tabs>
        </Paper>

        {/* SEARCH BAR */}
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: "16px",
            mb: 4,
            border: "1px solid #e2e8f0",
            bgcolor: "#fff",
          }}
        >
          <TextField
            fullWidth
            placeholder={
              tab === 0
                ? "Search shipped orders by ID, consignee, or city..."
                : "Search delivered orders by ID, consignee, or city..."
            }
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

        {/* LOADING INDICATOR */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
            <CircularProgress sx={{ color: "#1d4ed8" }} />
          </Box>
        )}

        {/* SHIPPED TAB */}
        {!loading && tab === 0 && (
          <>
            {filteredShipped.length === 0 ? (
              <EmptyState text="No shipped orders found." />
            ) : (
              filteredShipped.map((order) => (
                <OrderCard key={order.order_id} order={order} status="Shipped" />
              ))
            )}
          </>
        )}

        {/* DELIVERED TAB */}
        {!loading && tab === 1 && (
          <>
            {filteredDelivered.length === 0 ? (
              <EmptyState text="No delivered orders found." />
            ) : (
              filteredDelivered.map((order) => (
                <OrderCard key={order.order_id} order={order} status="Delivered" />
              ))
            )}
          </>
        )}
      </Box>
    </Box>
  );
}

// ── Reusable Order Card Component ─────────────────────────────

function OrderCard({ order, status }) {
  const isShipped = status === "Shipped";

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: "16px",
        border: "1px solid #e2e8f0",
        bgcolor: "#fff",
        mb: 2.5,
        p: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1.5,
        }}
      >
        <Box>
          <Typography variant="caption" fontWeight={700} sx={{ color: "#94a3b8" }}>
            ORDER #{order.order_id}
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.7,
              mt: 0.3,
            }}
          >
            <PersonOutlineRoundedIcon sx={{ fontSize: 16, color: "#64748b" }} />
            <Typography variant="body2" fontWeight={700} sx={{ color: "#1e293b" }}>
              {order.consignee_name}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.7,
              mt: 0.3,
            }}
          >
            <PlaceOutlinedIcon sx={{ fontSize: 15, color: "#94a3b8" }} />
            <Typography variant="body2" sx={{ color: "#64748b" }}>
              {order.address}, {order.city}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ textAlign: "right" }}>
          <Chip
            label={status}
            size="small"
            sx={{
              fontWeight: 700,
              bgcolor: isShipped ? "#eff6ff" : "#f0fdf4",
              color: isShipped ? "#1d4ed8" : "#15803d",
              border: `1px solid ${isShipped ? "#bfdbfe" : "#dcfce7"}`,
              mb: 0.7,
            }}
          />
          <Typography variant="caption" sx={{ display: "block", color: "#94a3b8" }}>
            {order.order_date
              ? new Date(order.order_date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "—"}
          </Typography>
          <Typography
            variant="body2"
            fontWeight={800}
            sx={{ color: isShipped ? "#2563eb" : "#16a34a", mt: 0.4 }}
          >
            Rs. {Number(order.total_amount || 0).toLocaleString()}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}

function EmptyState({ text }) {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: "16px",
        border: "1px solid #e2e8f0",
        bgcolor: "#fff",
        p: 8,
        textAlign: "center",
      }}
    >
      <CheckCircleOutlineRoundedIcon
        sx={{ fontSize: 48, color: "#cbd5e1", mb: 1 }}
      />
      <Typography variant="subtitle1" fontWeight={700} sx={{ color: "#334155" }}>
        {text}
      </Typography>
    </Paper>
  );
}