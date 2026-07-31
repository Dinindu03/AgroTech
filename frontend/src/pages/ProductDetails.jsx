import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  InputAdornment,
  Chip,
  Paper,
  Avatar,
  Stack,
} from "@mui/material";

// Modern SaaS-style Outlined Icons
import SearchIcon from "@mui/icons-material/SearchOutlined";
import Inventory2Icon from "@mui/icons-material/Inventory2Outlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import WarningAmberIcon from "@mui/icons-material/WarningAmberOutlined";
import CancelIcon from "@mui/icons-material/CancelOutlined";
import FilterListIcon from "@mui/icons-material/FilterListOutlined";

import AdminSidebar from "../components/AdminNavbar";

const SIDEBAR_WIDTH = 260; // Structural offset matching your new sidebar

export default function ProductDashboard() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/products/all"
      );
      setProducts(res.data.products);
    } catch (err) {
      console.log(err);
    }
  };

  const filteredProducts = products.filter((product) => {
    const searchMatch =
      product.name?.toLowerCase().includes(search.toLowerCase()) ||
      product.product_id?.toLowerCase().includes(search.toLowerCase()) ||
      product.supplier?.toLowerCase().includes(search.toLowerCase());

    const categoryMatch =
      category === "" || product.category === category;

    return searchMatch && categoryMatch;
  });

  const totalProducts = products.length;

  const inStock = products.filter(
    (p) => Number(p.stock) > 20
  ).length;

  const lowStock = products.filter(
    (p) => Number(p.stock) > 0 && Number(p.stock) <= 20
  ).length;

  const outOfStock = products.filter(
  (p) => Number(p.stock) <= 0
).length;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8fafc" }}>
      {/* Permanent Structural Navigation Menu Component */}
      <AdminSidebar />

      {/* Main Panel View Area Container */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
          p: { xs: 3, md: 5 },
          transition: "all 0.2s ease-in-out",
        }}
      >
        {/* Workspace Brand Header */}
        <Box mb={4}>
          <Typography
            variant="h4"
            fontWeight={800}
            sx={{ color: "#0f172a", letterSpacing: "-0.5px" }}
          >
            Product Inventory Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5 }}>
            Manage all TechAgro products and inventory records in real-time
          </Typography>
        </Box>

        {/* Analytic Metrics Summary Row */}
        <Grid container spacing={3} mb={4}>
          {[
            { label: "Total Products", value: totalProducts, icon: <Inventory2Icon />, color: "#3b82f6", bg: "rgba(59, 130, 246, 0.08)" },
            { label: "In Stock", value: inStock, icon: <CheckCircleIcon />, color: "#22c55e", bg: "rgba(34, 197, 94, 0.08)" },
            { label: "Low Stock", value: lowStock, icon: <WarningAmberIcon />, color: "#eab308", bg: "rgba(234, 179, 8, 0.08)" },
            { label: "Out of Stock", value: outOfStock, icon: <CancelIcon />, color: "#ef4444", bg: "rgba(239, 68, 68, 0.08)" },
          ].map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.01)" }}>
                <CardContent sx={{ p: 3, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Box>
                    <Typography variant="caption" fontWeight={600} sx={{ color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      {stat.label}
                    </Typography>
                    <Typography variant="h4" fontWeight={800} sx={{ color: "#1e293b", mt: 0.5, lineHeight: 1 }}>
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

        {/* Operational Query Filtering Deck */}
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: "16px",
            mb: 4,
            border: "1px solid #e2e8f0",
            bgcolor: "#fff"
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                placeholder="Search by ID, Name or Supplier..."
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
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                label="Filter Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FilterListIcon sx={{ color: "#94a3b8", fontSize: "1.1rem" }} />
                    </InputAdornment>
                  )
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    "& fieldset": { borderColor: "#e2e8f0" },
                  }
                }}
              >
                <MenuItem value="">All Categories</MenuItem>
                <MenuItem value="Seeds">Seeds</MenuItem>
                <MenuItem value="Fertilizers">Fertilizers</MenuItem>
                <MenuItem value="Plants">Plants</MenuItem>
                <MenuItem value="Machinery">Machinery</MenuItem>
                <MenuItem value="IoT Devices">IoT Devices</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </Paper>

        {/* Data Records View Wrapper */}
        <Paper 
          elevation={0} 
          sx={{ 
            borderRadius: "16px", 
            border: "1px solid #e2e8f0", 
            overflow: "hidden", 
            bgcolor: "#fff" 
          }}
        >
          {/* Custom Grid Layout Table Header */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "100px 2fr 130px 120px 110px 140px 140px 120px",
              gap: 2,
              p: 2.5,
              bgcolor: "#f8fafc",
              borderBottom: "1px solid #e2e8f0",
            }}
          >
            {["ID", "Product Identity", "Category", "Unit Price", "Stock Level", "Supplier", "Added By", "Status"].map((col, idx) => (
              <Typography
                key={idx}
                variant="caption"
                fontWeight={700}
                sx={{ color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}
              >
                {col}
              </Typography>
            ))}
          </Box>

          {/* Dynamic Row Rendering Engine */}
          {filteredProducts.map((product) => {
            const stockNum = Number(product.stock);
            const isInStock = stockNum > 20;
            const isLowStock = stockNum > 0 && stockNum <= 20;

            return (
              <Box
                key={product.product_id}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "100px 2fr 130px 120px 110px 140px 140px 120px",
                  gap: 2,
                  p: 2.5,
                  borderBottom: "1px solid #f1f5f9",
                  alignItems: "center",
                  transition: "background 0.2s ease",
                  "&:hover": { bgcolor: "#f8fafc" },
                }}
              >
                {/* ID index node */}
                <Typography variant="body2" fontWeight={600} sx={{ color: "#64748b" }}>
                  {product.product_id}
                </Typography>

                {/* Identity Object Node (Avatar & Name) */}
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar
                    src={product.image}
                    variant="rounded"
                    sx={{ width: 40, height: 40, borderRadius: "8px", border: "1px solid #e2e8f0" }}
                  />
                  <Typography variant="body2" fontWeight={600} sx={{ color: "#1e293b" }}>
                    {product.name}
                  </Typography>
                </Box>

                {/* Category Node */}
                <Box>
                  <Chip 
                    label={product.category} 
                    size="small" 
                    sx={{ bgcolor: "#f1f5f9", color: "#475569", fontWeight: 500, borderRadius: "6px" }} 
                  />
                </Box>

                {/* Pricing Node */}
                <Typography variant="body2" fontWeight={600} sx={{ color: "#0f172a" }}>
                  Rs. {Number(product.price).toLocaleString()}
                </Typography>

                {/* Quantitative Units Node */}
                <Typography 
                  variant="body2" 
                  fontWeight={600} 
                  sx={{ color: isLowStock ? "#eab308" : stockNum === 0 ? "#ef4444" : "#1e293b" }}
                >
                  {product.stock} units
                </Typography>

                {/* Supplier Node */}
                <Typography variant="body2" sx={{ color: "#475569" }}>
                  {product.supplier || "—"}
                </Typography>

                {/* Operator Logging Tracker Node */}
                <Typography variant="body2" sx={{ color: "#64748b" }}>
                  {product.enteredBy || "—"}
                </Typography>

                {/* Status Indicator Badge Node */}
                <Box>
                  <Chip
                    size="small"
                    label={isInStock ? "In Stock" : isLowStock ? "Low Stock" : "Out of Stock"}
                    sx={{
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      bgcolor: isInStock ? "#f0fdf4" : isLowStock ? "#fef9c3" : "#fef2f2",
                      color: isInStock ? "#15803d" : isLowStock ? "#a16207" : "#ef4444",
                      border: `1px solid ${isInStock ? "#dcfce7" : isLowStock ? "#fef08a" : "#fee2e2"}`,
                    }}
                  />
                </Box>
              </Box>
            );
          })}

          {/* Empty Fallback State Layout view wrapper */}
          {filteredProducts.length === 0 && (
            <Box sx={{ p: 8, textAlign: "center" }}>
              <Typography variant="subtitle1" color="text.secondary" fontWeight={600}>
                No products found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ color: "#94a3b8" }}>
                Try adjusting your text keywords or category selections.
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
}