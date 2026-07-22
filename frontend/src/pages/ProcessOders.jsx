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
  Divider,
  List,
  ListItem,
  Button,
  CircularProgress,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/SearchOutlined";
import Inventory2Icon from "@mui/icons-material/Inventory2Outlined";
import HourglassEmptyRoundedIcon from "@mui/icons-material/HourglassEmptyRounded";
import LocalShippingIcon from "@mui/icons-material/LocalShippingOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";

import AdminSidebar from "../components/AdminNavbar";

const SIDEBAR_WIDTH = 260;
const API_URL = "http://localhost:5000/api/orders/all";

export default function PackingDepartment() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
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

  const handleConfirmPacked = async (order) => {
    try {
      setUpdatingId(order.order_id);

      const res = await axios.put(
        `http://localhost:5000/api/orders/update-status/${order.order_id}`,
        { shipping_status: "Ready to Ship" }
      );

      if (res.data.success) {
        setOrders((prev) =>
          prev.map((o) =>
            o.order_id === order.order_id
              ? { ...o, shipping_status: "Ready to Ship" }
              : o
          )
        );
      }
    } catch (err) {
      console.error("Confirm Packing Error:", err);
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
              onConfirmPacked={() => handleConfirmPacked(order)}
            />
          ))}
      </Box>
    </Box>
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
        border: "1px solid #e2e8f0",
        bgcolor: "#fff",
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
          bgcolor: "#f8fafc",
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
              {order.address}, {order.city}
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
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                {item.image && (
                  <Box
                    component="img"
                    src={item.image}
                    alt={item.product_name}
                    sx={{ width: 40, height: 40, borderRadius: "8px", objectFit: "cover", border: "1px solid #e2e8f0" }}
                  />
                )}
                <Box>
                  <Typography variant="body2" fontWeight={700} sx={{ color: "#1e293b" }}>
                    {item.product_name}
                  </Typography>
                  {item.sku && (
                    <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                      SKU: {item.sku}
                    </Typography>
                  )}
                </Box>
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