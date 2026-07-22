import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Container,
} from "@mui/material";

import Navbar from "../components/Navbar";

import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import InventoryIcon from "@mui/icons-material/Inventory";
import Grass from "@mui/icons-material/Grass";

/* ---------------------------------------------------------------
   Shared with About.jsx / Footer.jsx — "Field & Ledger" tokens.
------------------------------------------------------------------ */
const c = {
  moss: "#16301F",
  mossMid: "#25492F",
  sage: "#7FA06B",
  gold: "#D9A441",
  goldDeep: "#B8842B",
  soil: "#5B3E2B",
  paper: "#F7F5EC",
  paperDeep: "#EFEBDC",
  ink: "#1C2A1E",
  mist: "#EDEFE6",
};

const fontDisplay = "Georgia, 'Iowan Old Style', 'Palatino Linotype', Palatino, serif";
const fontMono =
  "'SFMono-Regular', 'Consolas', 'Liberation Mono', Menlo, Monaco, monospace";

/* ---------------------------------------------------------------
   Visual Category Mapper
------------------------------------------------------------------ */
const categoryVisualMap = {
  plant: { emoji: "🪴", bg: "linear-gradient(135deg, #D9F2D2, #A8DDA0)" },
  seed: { emoji: "🌱", bg: "linear-gradient(135deg, #E4F7D6, #BFE89A)" },
  fertilizer: { emoji: "🌾", bg: "linear-gradient(135deg, #FBEAB0, #EFC85A)" },
  machinery: { emoji: "🚜", bg: "linear-gradient(135deg, #FFD9B3, #FFAD60)" },
  "iot device": { emoji: "📡", bg: "linear-gradient(135deg, #C7E7F5, #82C4E0)" },
};

const defaultVisual = { emoji: "🌿", bg: "linear-gradient(135deg, #E4D9C8, #C7A97E)" };

function getCategoryVisual(category) {
  const key = (category || "").trim().toLowerCase();

  if (key.includes("seed")) return categoryVisualMap.seed;
  if (key.includes("plant")) return categoryVisualMap.plant;
  if (key.includes("fertiliz")) return categoryVisualMap.fertilizer;
  if (key.includes("machin") || key.includes("machen")) return categoryVisualMap.machinery;
  if (key.includes("iot")) return categoryVisualMap["iot device"];

  return defaultVisual;
}

function Shop({ cart, setCart, cartTotalPrice, setSnackbar }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [cartLoaded, setCartLoaded] = useState(false);

  const navigate = useNavigate();

  // ================= FETCH PRODUCTS =================
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products/all");
      setProducts(res.data.products || []);
    } catch (err) {
      console.error("Error pulling database inventory items", err);
    }
  };

  // ================= LOAD USER CART =================
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      setCart([]);
      setCartLoaded(true);
      return;
    }

    try {
      const user = JSON.parse(storedUser);
      const userCartKey = `cart_${user.email}`;
      const savedCart = localStorage.getItem(userCartKey);

      if (savedCart) {
        setCart(JSON.parse(savedCart));
      } else {
        setCart([]);
      }

      setCartLoaded(true);
    } catch (error) {
      console.error("Error loading user cart:", error);
      setCart([]);
      setCartLoaded(true);
    }
  }, [setCart]);

  // ================= SAVE USER CART =================
  useEffect(() => {
    if (!cartLoaded) return;

    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    try {
      const user = JSON.parse(storedUser);
      const userCartKey = `cart_${user.email}`;
      localStorage.setItem(userCartKey, JSON.stringify(cart));
    } catch (error) {
      console.error("Error saving user cart:", error);
    }
  }, [cart, cartLoaded]);

  // ================= ADD TO CART =================
  const addToCart = (product) => {
    const storedUser = localStorage.getItem("user");

    // User not logged in
    if (!storedUser) {
      setSnackbar({
        open: true,
        message: "Please login to add products to your cart.",
      });
      navigate("/login");
      return;
    }

    const productId = product.product_id || product.id || product._id;

    if (!productId) {
      console.error("Product ID missing:", product);
      setSnackbar({
        open: true,
        message: "Product ID missing.",
      });
      return;
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => (item.product_id || item.id || item._id) === productId
      );

      if (existingItem) {
        return prevCart.map((item) =>
          (item.product_id || item.id || item._id) === productId
            ? { ...item, quantity: Number(item.quantity) + 1 }
            : item
        );
      }

      return [
        ...prevCart,
        {
          ...product,
          product_id: productId,
          quantity: 1,
        },
      ];
    });

    setSnackbar({
      open: true,
      message: `${product.name} added to cart.`,
    });
  };

  // ================= SEARCH =================
  const filteredProducts = products.filter((item) =>
    item.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: c.paper, pb: 8 }}>
      {/* NAVBAR */}
      <Navbar cart={cart} setCart={setCart} cartTotalPrice={cartTotalPrice} />

      {/* HERO */}
      <Box
        sx={{
          background: `linear-gradient(160deg, ${c.mist} 0%, ${c.paperDeep} 100%)`,
          borderBottom: `1px solid ${c.paperDeep}`,
          pt: 8,
          pb: 10,
          mb: 6,
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Grass
          sx={{
            position: "absolute",
            fontSize: 260,
            color: "rgba(22,48,31,0.04)",
            top: -60,
            right: -40,
          }}
        />

        <Container maxWidth="lg" sx={{ position: "relative" }}>
          <Box
            sx={{
              fontFamily: fontMono,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontSize: "11.5px",
              fontWeight: 600,
              color: c.goldDeep,
              mb: 2,
            }}
          >
            Field-ready inventory
          </Box>

          <Typography
            variant="h3"
            sx={{ fontFamily: fontDisplay, fontWeight: 600, color: c.ink, mb: 1.5 }}
          >
            Marketplace
          </Typography>

          <Typography
            variant="body1"
            sx={{ color: c.soil, maxWidth: "520px", mx: "auto", mb: 4, lineHeight: 1.7 }}
          >
            Explore high-grade materials, precision instruments, and smart solutions built to
            scale production yield.
          </Typography>

          {/* SEARCH BAR */}
          <Box maxWidth="md" sx={{ mx: "auto" }}>
            <TextField
              fullWidth
              placeholder="Search active catalog..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: c.soil }} />
                  </InputAdornment>
                ),
              }}
              sx={searchBarStyles}
            />
          </Box>
        </Container>
      </Box>

      {/* PRODUCTS GRID */}
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {filteredProducts.map((product) => {
            const isOutOfStock = product.stock <= 0;

            return (
              <Grid key={product.id || product._id || product.product_id} item xs={12} sm={6} md={4} lg={3}>
                <Card sx={productCardStyles(isOutOfStock)}>
                  {/* VISUAL TILE */}
                  <Box
                    sx={{
                      position: "relative",
                      overflow: "hidden",
                      pt: "80%",
                      background: getCategoryVisual(product.category).bg,
                    }}
                  >
                    <Box
                      className="product-emoji"
                      sx={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "64px",
                        lineHeight: 1,
                        transition: "transform 0.4s ease",
                        filter: isOutOfStock ? "grayscale(1) opacity(0.5)" : "none",
                      }}
                    >
                      {getCategoryVisual(product.category).emoji}
                    </Box>

                    <Box sx={{ position: "absolute", top: 16, left: 16, zIndex: 2 }}>
                      <Chip label={product.category || "General"} size="small" sx={chipCategoryStyles} />
                    </Box>
                  </Box>

                  {/* DETAILS */}
                  <CardContent sx={{ p: 3, flexGrow: 1, display: "flex", flexDirection: "column" }}>
                    <Typography variant="h6" sx={productTitleTextStyles}>
                      {product.name}
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 2 }}>
                      <InventoryIcon
                        sx={{ fontSize: 14, color: isOutOfStock ? "#B3261E" : c.sage }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          color: isOutOfStock ? "#B3261E" : c.soil,
                          fontWeight: 600,
                        }}
                      >
                        {isOutOfStock ? "Out of Stock" : `In Stock: ${product.stock}`}
                      </Typography>
                    </Box>

                    <Box sx={{ mt: "auto", pt: 1 }}>
                      <Typography
                        sx={{
                          color: isOutOfStock ? "rgba(28,42,30,0.3)" : c.goldDeep,
                          fontFamily: fontDisplay,
                          fontWeight: 700,
                          fontSize: "1.4rem",
                          mb: 2,
                        }}
                      >
                        Rs. {Number(product.price).toLocaleString()}
                      </Typography>

                      <Button
                        fullWidth
                        variant={isOutOfStock ? "outlined" : "contained"}
                        disabled={isOutOfStock}
                        onClick={() => addToCart(product)}
                        startIcon={!isOutOfStock && <ShoppingCartIcon />}
                        sx={addToCartBtnStyles(isOutOfStock)}
                      >
                        {isOutOfStock ? "Sold Out" : "Add To Cart"}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
}

/* ================= STYLES ================= */

const searchBarStyles = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "16px",
    backgroundColor: "#ffffff",
    color: c.ink,
    transition: "all 0.3s ease",

    "& fieldset": {
      borderColor: c.paperDeep,
    },

    "&:hover fieldset": {
      borderColor: c.sage,
    },

    "&.Mui-focused fieldset": {
      borderColor: c.gold,
      borderWidth: "1.5px",
    },

    "& input::placeholder": {
      color: "rgba(28,42,30,0.4)",
      opacity: 1,
    },
  },
};

const productCardStyles = (isOutOfStock) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  borderRadius: "20px",
  bgcolor: "#ffffff",
  border: `1px solid ${c.paperDeep}`,
  overflow: "hidden",
  transition: "all 0.3s ease",
  boxShadow: "0 6px 20px rgba(22,48,31,0.05)",

  "&:hover": {
    transform: "translateY(-6px)",
    borderColor: isOutOfStock ? c.paperDeep : c.sage,
    boxShadow: isOutOfStock
      ? "0 15px 35px rgba(22,48,31,0.08)"
      : "0 15px 35px rgba(22,48,31,0.12)",

    "& .product-emoji": {
      transform: "scale(1.12)",
    },
  },
});

const chipCategoryStyles = {
  fontWeight: 700,
  fontSize: "0.68rem",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  bgcolor: "#ffffff",
  color: c.goldDeep,
  border: `1px solid ${c.gold}`,
};

const productTitleTextStyles = {
  color: c.ink,
  fontWeight: 700,
  fontSize: "1.1rem",
  mb: 1,
  minHeight: "2.6em",
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
};

const addToCartBtnStyles = (isOutOfStock) => ({
  py: 1.2,
  borderRadius: "12px",
  fontWeight: 700,
  textTransform: "none",
  fontSize: "0.9rem",
  transition: "all 0.2s ease",

  ...(isOutOfStock
    ? {
        borderColor: c.paperDeep,
        color: "rgba(28,42,30,0.3) !important",
      }
    : {
        background: `linear-gradient(135deg, ${c.mossMid}, ${c.moss})`,
        boxShadow: "0 4px 15px rgba(22,48,31,0.2)",

        "&:hover": {
          background: `linear-gradient(135deg, ${c.moss}, ${c.mossMid})`,
        },
      }),
});

export default Shop;