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
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import AdminSidebar from "../components/AdminNavbar";

const API_BASE = "http://localhost:5000/api/updateproducts";

const EMPTY_PRODUCT = {
  id: "",
  name: "",
  brand: "",
  category: "",
  price: "",
  stock: "",
  supplier: "",
  enteredBy: "",
  date: "",
  description: "",
};

export default function UpdateProduct() {
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);

  const [product, setProduct] = useState(null); // null until a product is loaded for editing
  const [saving, setSaving] = useState(false);

  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });
  const showToast = (message, severity = "success") => setToast({ open: true, message, severity });

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!query.trim()) return;

    try {
      setSearching(true);
      setSearched(true);
      setProduct(null);
      const res = await axios.get(`${API_BASE}/search`, { params: { query: query.trim() } });

      if (res.data?.success) {
        const matches = res.data.products || [];
        if (matches.length === 1) {
          loadProduct(matches[0]);
          setResults([]);
        } else {
          setResults(matches);
        }
      } else {
        setResults([]);
        showToast(res.data?.message || "No matching products found.", "error");
      }
    } catch (err) {
      console.error("Search product error:", err);
      setResults([]);
      showToast(err.response?.data?.message || "Couldn't reach the server.", "error");
    } finally {
      setSearching(false);
    }
  };

  const loadProduct = (p) => {
    setProduct({
      id: p.id ?? p.product_id ?? "",
      name: p.name ?? "",
      brand: p.brand ?? "",
      category: p.category ?? "",
      price: p.price ?? "",
      stock: p.stock ?? "",
      supplier: p.supplier ?? "",
      enteredBy: p.enteredBy ?? p.entered_by ?? "",
      date: p.date ?? p.entry_date ?? "",
      description: p.description ?? "",
    });
    setResults([]);
  };

  const handleChange = (e) => {
    setProduct((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product) return;

    try {
      setSaving(true);
      const { id, ...updates } = product; // product_id is never sent for update

      const res = await axios.put(`${API_BASE}/update/${encodeURIComponent(id)}`, updates);

      if (res.data?.success) {
        showToast(res.data?.message || "Product updated successfully.");
      } else {
        showToast(res.data?.message || "Couldn't update product.", "error");
      }
    } catch (err) {
      console.error("Update product error:", err);
      showToast(err.response?.data?.message || "Couldn't update product. Try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8fafc" }}>
      <AdminSidebar />

      <Box
        sx={{
          flexGrow: 1,
          p: { xs: 3, md: 5 },
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 1050 }}>
          {/* SEARCH PANEL */}
          <Paper
            elevation={0}
            component="form"
            onSubmit={handleSearch}
            sx={{
              p: { xs: 3, sm: 4 },
              borderRadius: "24px",
              bgcolor: "#ffffff",
              border: "1px solid #e2e8f0",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.02), 0 8px 10px -6px rgba(0, 0, 0, 0.02)",
              mb: 4,
            }}
          >
            <Typography variant="h4" fontWeight="800" sx={{ color: "#0f172a", letterSpacing: "-1px", mb: 0.5 }}>
              Update Product
            </Typography>
            <Typography color="#64748b" variant="body1" sx={{ mb: 3 }}>
              Search by Product ID or name to load and edit its details.
            </Typography>

            <Box sx={{ display: "flex", gap: 1.5 }}>
              <TextField
                fullWidth
                placeholder="Search by Product ID (e.g. PROD-4F2A) or name"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "#94a3b8" }} />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={searching || !query.trim()}
                sx={{
                  bgcolor: "#1B5E20",
                  fontWeight: 600,
                  borderRadius: "12px",
                  px: 4,
                  textTransform: "none",
                  whiteSpace: "nowrap",
                  "&:hover": { bgcolor: "#144d19" },
                }}
              >
                {searching ? <CircularProgress size={20} sx={{ color: "#fff" }} /> : "Search"}
              </Button>
            </Box>

            {/* MULTIPLE MATCHES — pick one to load */}
            {results.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Divider sx={{ mb: 1.5 }} />
                <Typography sx={{ fontSize: "0.82rem", color: "#64748b", mb: 1 }}>
                  {results.length} matches — select one to edit:
                </Typography>
                <List disablePadding>
                  {results.map((p) => (
                    <ListItemButton
                      key={p.id ?? p.product_id}
                      onClick={() => loadProduct(p)}
                      sx={{ borderRadius: "10px", mb: 0.5 }}
                    >
                      <ListItemText
                        primary={p.name}
                        secondary={`${p.id ?? p.product_id} · Rs. ${Number(p.price).toLocaleString()} · Stock: ${p.stock}`}
                      />
                    </ListItemButton>
                  ))}
                </List>
              </Box>
            )}

            {searched && !searching && results.length === 0 && !product && (
              <Typography sx={{ mt: 2, fontSize: "0.85rem", color: "#94a3b8" }}>
                No products matched "{query}".
              </Typography>
            )}
          </Paper>

          {/* EDIT FORM — only shown once a product is loaded */}
          {product && (
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, sm: 4, md: 5 },
                borderRadius: "24px",
                bgcolor: "#ffffff",
                border: "1px solid #e2e8f0",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.02), 0 8px 10px -6px rgba(0, 0, 0, 0.02)",
              }}
            >
              <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="800" sx={{ color: "#0f172a", letterSpacing: "-1px", mb: 0.5 }}>
                  Edit Product
                </Typography>
                <Typography color="#64748b" variant="body1">
                  Update any field below. The Product ID is fixed and cannot be changed.
                </Typography>
              </Box>

              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={4}>
                  {/* LEFT COLUMN */}
                  <Grid item xs={12} md={7}>
                    <Grid container spacing={2.5}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Product ID"
                          name="id"
                          value={product.id}
                          InputProps={{
                            readOnly: true,
                            endAdornment: (
                              <InputAdornment position="end">
                                <LockOutlinedIcon sx={{ fontSize: 18, color: "#94a3b8" }} />
                              </InputAdornment>
                            ),
                          }}
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
                          name="enteredBy"
                          value={product.enteredBy}
                          onChange={handleChange}
                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
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

                  {/* RIGHT COLUMN */}
                  <Grid item xs={12} md={5} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Description"
                      name="description"
                      value={product.description}
                      onChange={handleChange}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={saving}
                      sx={{
                        bgcolor: "#1B5E20",
                        fontWeight: "600",
                        borderRadius: "12px",
                        py: 2,
                        textTransform: "none",
                        fontSize: "1rem",
                        boxShadow: "0 4px 12px rgba(27, 94, 32, 0.15)",
                        "&:hover": { bgcolor: "#144d19" },
                      }}
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>

                    <Button
                      variant="text"
                      onClick={() => {
                        setProduct(null);
                        setQuery("");
                        setSearched(false);
                      }}
                      sx={{ textTransform: "none", color: "#64748b" }}
                    >
                      Search a different product
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          )}
        </Box>
      </Box>

      <Snackbar
        open={toast.open}
        autoHideDuration={3500}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setToast((t) => ({ ...t, open: false }))} severity={toast.severity} variant="filled">
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}