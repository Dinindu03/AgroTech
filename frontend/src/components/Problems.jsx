import React from "react";
import {
  Box,
  Typography,
  Container,
} from "@mui/material";

import ProductAndService from "../assets/problems.jpg";

const Problems = () => {
  const services = [
    {
      question: "Low crop yield?",
      answer: "Soil-specific fertilizer solutions",
    },
    
    {
      question: "Water management problems?",
      answer: "Efficient irrigation systems and piping",
    },
    {
      question: "Climate change impacts?",
      answer: "IoT-based smart farming solutions",
    },
    {
      question: "Labour shortages?",
      answer: "Modern agricultural machinery",
    },
  ];

  return (
    <Box
      id="problems"
      sx={{
        position: "relative",
        height: "750px",
        backgroundImage: `
          linear-gradient(
            rgba(0,0,0,0.3),
            rgba(0,0,0,0.3)
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
          bgcolor: "rgba(0,0,0,0.2)",
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
        <Box sx={{ maxWidth: "900px", color: "#fff" }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: "bold",
              mb: 3,
            }}
          >
            Common Farming Problems We Solve
          </Typography>

          <Typography
            variant="h6"
            sx={{
              mb: 5,
              color: "rgba(255,255,255,0.85)",
            }}
          >
            We understand the real challenges farmers face.
          </Typography>

          {/* Question & Answer */}
          {services.map((item, index) => (
        <Box key={index} sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "#fff",
            }}
          >
            {item.question}
          </Typography>

          <Typography
            sx={{
              color: "rgba(255,255,255,0.8)",
              ml: 2,
            }}
          >
            {item.answer}
          </Typography>
        </Box>
      ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Problems;