import React from "react";
import {
  Box,
  Typography,
  Button,
  Container,
} from "@mui/material";

import ProductAndService from "../assets/ProductAndService.jpg";

const ProductServiceRange = () => {
  const services = [
    "Fertilizers & Plant Nutrition",
    "Seeds & Planting Materials",
    "Crop Protection Products",
    "Agricultural Machinery (Tractors, Harvesters)",
    "Irrigation & Water Management Systems",
  ];

  return (
    <Box
      id="products"
      sx={{
        position: "relative",
        height: "750px",
        backgroundImage: `
                            linear-gradient(
                                rgba(160, 160, 160, 0),
                                rgba(69, 70, 68, 0)
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
              mb: 3,
              color: "rgba(255,255,255,0.85)",
            }}
          >
            We provide a complete range of agriculture solutions:
          </Typography>

          <Box component="ul" sx={{ pl: 3, mb: 4 }}>
            {services.map((item, index) => (
              <Typography
                component="li"
                key={index}
                sx={{
                  mb: 1,
                  fontSize: "18px",
                }}
              >
                {item}
              </Typography>
            ))}
          </Box>

          <Button
            variant="outlined"
            sx={{
              color: "#fff",
              borderColor: "#fff",
              px: 4,
              py: 1.5,
              borderRadius: "12px",

              "&:hover": {
                bgcolor: "#fff",
                color: "#000",
                borderColor: "#fff",
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