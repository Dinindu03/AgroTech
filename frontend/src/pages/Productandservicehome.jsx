import React, { useState, useEffect } from "react"; // Added useEffect here
import { useLocation, useNavigate } from "react-router-dom"; // Added missing react-router hooks
import Navbar from "../components/Navbar"; // Capitalized N to match standard React components
import Footer from "../components/Footer";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Chip,
} from "@mui/material";

const products = [
  {
    id: 1,
    name: "Seeds",
    price: 1500,
    image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399",
  },
  {
    id: 2,
    name: "Fertilizer",
    price: 2000,
    image: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff",
  },
  {
    id: 3,
    name: "Plants",
    price: 750,
    image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735",
  },
  {
    id: 4,
    name: "Hardware Components",
    price: 3500,
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd",
  },
  {
    id: 5,
    name: "IoT Device",
    price: 15000,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
  },
  {
    id: 6,
    name: "Materials",
    price: 1200,
    image: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc",
  },
];

const Products = () => {
  const [cart, setCart] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  useEffect(() => {
    // Check if the previous page asked for a refresh
    if (location.state?.triggerRefresh) {
      // 1. Clear the state flag immediately so it doesn't loop on the next refresh
      navigate(location.pathname, { replace: true, state: {} });
      
      // 2. Force the browser to reload the page completely
      window.location.reload();
    }
  }, [location, navigate]);

  return (
    <Box sx={{ bgcolor: "#f8f9fa", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Self-correcting lowercase navbar tag to proper JSX component capitalization */}
      <Navbar />
      
      <Container maxWidth="lg" sx={{ py: 8, flexGrow: 1 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 5,
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              color: "#2E7D32",
            }}
          >
            Our Products
          </Typography>

          <Chip
            label={`Cart (${cart.length})`}
            color="success"
            sx={{ fontSize: "16px", p: 2 }}
          />
        </Box>

        {/* Product Grid */}
        <Grid container spacing={4}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: "16px",
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: 6,
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="220"
                  image={product.image}
                  alt={product.name}
                />

                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h5"
                    sx={{ fontWeight: "bold" }}
                  >
                    {product.name}
                  </Typography>

                  <Typography
                    variant="h6"
                    color="success.main"
                    sx={{ fontWeight: "bold" }}
                  >
                    Rs. {product.price.toLocaleString()}
                  </Typography>
                </CardContent>

                <CardActions sx={{ p: 2 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    onClick={() => addToCart(product)}
                  >
                    Add To Cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Cart Summary */}
        {cart.length > 0 && (
          <Box
            sx={{
              mt: 6,
              p: 4,
              bgcolor: "white",
              borderRadius: "16px",
              boxShadow: 2,
            }}
          >
            <Typography variant="h5" gutterBottom>
              Cart Summary
            </Typography>

            {cart.map((item, index) => (
              <Typography key={index}>
                • {item.name} - Rs. {item.price.toLocaleString()}
              </Typography>
            ))}

            <Typography
              variant="h6"
              sx={{
                mt: 3,
                fontWeight: "bold",
                color: "#2E7D32",
              }}
            >
              Total: Rs.{" "}
              {cart
                .reduce((total, item) => total + item.price, 0)
                .toLocaleString()}
            </Typography>

            <Button
              variant="contained"
              color="success"
              sx={{ mt: 3 }}
            >
              Proceed to Checkout
            </Button>
          </Box>
        )}
      </Container>

      {/* Added the imported Footer component at the bottom of the layout */}
      <Footer />
    </Box>
  );
};

export default Products;