import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  InputAdornment,
} from "@mui/material";

import AdminSidebar from "../components/AdminNavbar";

// Helper function positioned outside the component scope to avoid redeclaring on render
const generateProductId = () => {
  const randomHex = Math.random().toString(16).substring(2, 6).toUpperCase();
  return `PROD-${randomHex}`;
};

// Safe helper to extract admin name handling nested backend payload structures
const getAdminName = () => {
  try {
    const loggedUser = JSON.parse(localStorage.getItem("admin"));
    // Handles { name: "John" } OR nested structures like { admin: { name: "John" } }
    return loggedUser?.name || loggedUser?.admin?.name || "Admin";
  } catch (e) {
    return "Admin";
  }
};

export default function AddProduct() {
  const today = new Date().toISOString().split("T")[0];

  const [product, setProduct] = useState({
    id: generateProductId(),
    name: "",
    brand: "",
    category: "",
    price: "",
    stock: "",
    supplier: "",
    enteredBy: getAdminName(), // Pulls name securely on initial load
    date: today,
    description: "",
  });

  const handleChange = (e) => {
    setProduct((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/products/add",
        product,
        { headers: { "Content-Type": "application/json" } }
      );

      alert(response.data?.message || "Product Saved Successfully");

      // RESET FORM: Notice getAdminName() is run again to guarantee data is preserved
      setProduct({
        id: generateProductId(),
        name: "",
        brand: "",
        category: "",
        price: "",
        stock: "",
        supplier: "",
        enteredBy: getAdminName(),
        date: today,
        description: "",
      });
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Error saving product");
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8fafc" }}>
      {/* Sidebar Navigation */}
      <AdminSidebar />

      {/* Primary Layout Engine */}
      <Box
        sx={{
          flexGrow: 1,
          p: { xs: 3, md: 5 },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 1050,
            p: { xs: 3, sm: 4, md: 5 },
            borderRadius: "24px",
            bgcolor: "#ffffff",
            border: "1px solid #e2e8f0",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.02), 0 8px 10px -6px rgba(0, 0, 0, 0.02)",
          }}
        >
          {/* Section Header */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              fontWeight="800"
              sx={{ color: "#0f172a", letterSpacing: "-1px", mb: 0.5 }}
            >
              Create New Product
            </Typography>
            <Typography color="#64748b" variant="body1">
              Add catalog parameters, global pricing tiers, and supplier logs.
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={4}>
              {/* LEFT COLUMN: Core Metadata Fields */}
              <Grid item xs={12} md={7}>
                <Grid container spacing={2.5}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Product ID"
                      name="id"
                      value={product.id}
                      InputProps={{ readOnly: true }}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: "#f8fafc" } }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Product Name"
                      name="name"
                      value={product.name}
                      onChange={handleChange}
                      required
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Brand"
                      name="brand"
                      placeholder="e.g. AgroCorp"
                      value={product.brand}
                      onChange={handleChange}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      fullWidth
                      label="Category"
                      name="category"
                      value={product.category}
                      onChange={handleChange}
                      required
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                    >
                      <MenuItem value="Seeds">Seeds</MenuItem>
                      <MenuItem value="Fertilizers">Fertilizers</MenuItem>
                      <MenuItem value="Plants">Plants</MenuItem>
                      <MenuItem value="IoT Devices">IoT Devices</MenuItem>
                      <MenuItem value="Machinery">Machinery</MenuItem>
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Price"
                      name="price"
                      type="number"
                      value={product.price}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start" sx={{ fontWeight: 600, color: "#94a3b8" }}>
                            Rs.
                          </InputAdornment>
                        ),
                      }}
                      inputProps={{ min: 0, step: "0.01" }}
                      required
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Stock"
                      name="stock"
                      type="number"
                      value={product.stock}
                      onChange={handleChange}
                      inputProps={{ min: 0 }}
                      required
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Supplier"
                      name="supplier"
                      value={product.supplier}
                      onChange={handleChange}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Entered By"
                      value={product.enteredBy}
                      InputProps={{
                        readOnly: true,
                      }}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: "#f8fafc" } }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Entry Date"
                      name="date"
                      value={product.date}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* RIGHT COLUMN: Description + Submit */}
              <Grid item xs={12} md={5} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Description"
                  name="description"
                  placeholder="Describe key features or specifications..."
                  value={product.description}
                  onChange={handleChange}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                />

                {/* Primary Action Trigger */}
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: "#1B5E20",
                    fontWeight: "600",
                    borderRadius: "12px",
                    py: 2,
                    textTransform: "none",
                    fontSize: "1rem",
                    boxShadow: "0 4px 12px rgba(27, 94, 32, 0.15)",
                    "&:hover": {
                      bgcolor: "#144d19",
                    },
                  }}
                >
                  Save Product Entry
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}