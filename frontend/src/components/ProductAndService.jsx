import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Swapped Link for useNavigate
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Container,
} from "@mui/material";

import ProductAndService from "../assets/ProductAndService.jpg";

const ProductServiceRange = () => {
  const navigate = useNavigate(); // Hook for smooth client-side routing

  const products = [
    {
      title: "Machine Booking",
      description: "Book tractors, harvesters and farming equipment.",
    },
    {
      title: "Drone Booking",
      description: "Crop monitoring and pesticide spraying services.",
    },
    {
      title: "Seeds",
      description: "High-quality certified seeds for better yields.",
    },
    {
      title: "Fertilizers",
      description: "Organic and chemical fertilizers.",
    },
    {
      title: "Hardware Components",
      description: "Agricultural tools and spare parts.",
    },
    {
      title: "Plants",
      description: "Fruit, vegetable and ornamental plants.",
    },
    {
      title: "IoT Devices",
      description: "Smart sensors and farm monitoring devices.",
    },
    {
      title: "Materials",
      description: "Essential farming materials and supplies.",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === products.length - 1 ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [products.length]); // Added dependency here for stability

  const handleNavigation = () => {
  // Navigate to the page and pass a flag indicating it needs a refresh
  navigate("/Productandservicehome", { state: { triggerRefresh: true } }); 
};

  return (
    <Box
      id="products"
      sx={{
        position: "relative",
        height: "750px",
        backgroundImage: `
          linear-gradient(
            rgba(0,0,0,0.2),
            rgba(0,0,0,0.5)
          ),
          url(${ProductAndService})
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        overflow: "hidden",
      }}
    >
      {/* Overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          bgcolor: "rgba(0,0,0,0.55)",
        }}
      />

      {/* Content */}
      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 2,
          height: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box sx={{ maxWidth: "700px", color: "#fff" }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: "bold",
              mb: 3,
            }}
          >
            Our Product & Service Range
          </Typography>

          <Typography
            variant="h6"
            sx={{
              mb: 2,
              color: "rgba(255,255,255,0.85)",
            }}
          >
            Smart Agriculture Solutions for Modern Farmers
          </Typography>

          {/* Slideshow */}
          <Box
            sx={{
              minHeight: "150px",
              mb: 4,
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontWeight: "bold",
                color: "#85d488",
                mb: 2,
                transition: "0.5s ease",
              }}
            >
              {products[currentSlide].title}
            </Typography>

            <Typography
              variant="h5"
              sx={{
                color: "rgba(255,255,255,0.9)",
                lineHeight: 1.8,
                maxWidth: "600px",
              }}
            >
              {products[currentSlide].description}
            </Typography>
          </Box>

          {/* Indicators */}
          <Box sx={{ display: "flex", gap: 1, mb: 4 }}>
            {products.map((_, index) => (
              <Box
                key={index}
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  bgcolor:
                    currentSlide === index
                      ? "#8bdf8e"
                      : "rgba(255,255,255,0.4)",
                }}
              />
            ))}
          </Box>

          <Button
            onClick={handleNavigation}
            variant="contained"
            sx={{
              bgcolor: "#8bdf8e",
              px: 4,
              py: 1.5,
              borderRadius: "12px",
              fontWeight: "bold",
              color: "#fff", // Ensured text contrast on the button
              "&:hover": {
                bgcolor: "#388E3C",
              },
            }}
          >
            Explore More
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default ProductServiceRange;