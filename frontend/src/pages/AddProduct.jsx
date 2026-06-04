import React, { useState, useEffect } from "react";
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

export default function AddProduct() {
  const today = new Date().toISOString().split("T")[0];

  // Generate Product ID
  const generateProductId = () => {
    const randomHex = Math.random().toString(16).substring(2, 6).toUpperCase();
    return `PROD-${randomHex}`;
  };

  const [product, setProduct] = useState({
    id: "",
    name: "",
    brand: "",
    category: "",
    price: "",
    stock: "",
    supplier: "",
    enteredBy: "",
    date: today,
    description: "",
    image: null,
  });

  const [preview, setPreview] = useState("");

  // Auto generate ID on load
  useEffect(() => {
    setProduct((prev) => ({
      ...prev,
      id: generateProductId(),
    }));
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  // Handle image
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setProduct({
        ...product,
        image: file.name, // ⚠️ store only filename (simple approach)
      });

      setPreview(URL.createObjectURL(file));
    }
  };

  // Submit to backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/products/add",
        product
      );

      alert(response.data.message);

      // Reset form
      setProduct({
        id: generateProductId(),
        name: "",
        brand: "",
        category: "",
        price: "",
        stock: "",
        supplier: "",
        enteredBy: "",
        date: today,
        description: "",
        image: null,
      });

      setPreview("");
    } catch (error) {
      console.log(error);
      alert("Error saving product");
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc", p: 4 }}>
      <Paper sx={{ maxWidth: 1100, mx: "auto", p: 4, borderRadius: 3 }}>
        
        <Typography variant="h4" fontWeight="bold" mb={3}>
          Create New Product
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>

            {/* LEFT SIDE */}
            <Grid item xs={12} md={7}>
              <Grid container spacing={2}>

                <Grid item xs={12}>
                  <TextField fullWidth label="Product ID" name="id" value={product.id} />
                </Grid>

                <Grid item xs={12}>
                  <TextField fullWidth label="Product Name" name="name" value={product.name} onChange={handleChange} required />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Brand" name="brand" value={product.brand} onChange={handleChange} />
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
                        <InputAdornment position="start">Rs.</InputAdornment>
                      ),
                    }}
                    required
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
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField fullWidth label="Supplier" name="supplier" value={product.supplier} onChange={handleChange} />
                </Grid>

                <Grid item xs={12}>
                  <TextField fullWidth label="Entered By" name="enteredBy" value={product.enteredBy} onChange={handleChange} />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="date"
                    name="date"
                    value={product.date}
                    onChange={handleChange}
                  />
                </Grid>

              </Grid>
            </Grid>

            {/* RIGHT SIDE */}
            <Grid item xs={12} md={5}>

              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                name="description"
                value={product.description}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />

              {/* IMAGE */}
              <Box sx={{ border: "2px dashed #ccc", p: 2, textAlign: "center", mb: 2 }}>
                {!preview ? (
                  <>
                    <Typography>Upload Image</Typography>
                    <Button component="label">
                      Choose File
                      <input hidden type="file" onChange={handleImageChange} />
                    </Button>
                  </>
                ) : (
                  <>
                    <img
                      src={preview}
                      alt="preview"
                      style={{ width: "100%", maxHeight: 200, objectFit: "contain" }}
                    />
                    <Button onClick={() => setPreview("")}>Remove</Button>
                  </>
                )}
              </Box>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ bgcolor: "#1B5E20", py: 1.5 }}
              >
                Save Product
              </Button>

            </Grid>

          </Grid>
        </form>

      </Paper>
    </Box>
  );
}