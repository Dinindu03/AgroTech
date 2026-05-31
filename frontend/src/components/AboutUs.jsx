import React from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Container,
  Button,
} from "@mui/material";

import heroImage from "../assets/AboutUs.jpg";

function AboutUs() {
  return (
    <Box sx={{ background: "#f5f7f2" }}>
      
      {/* HERO SECTION */}
     

                <Box
                sx={{
                    position: "relative",
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    overflow: "hidden",

                    backgroundImage: `
                    linear-gradient(
                        rgba(32, 33, 32, 0.41),
                        rgba(69, 70, 68, 0.25)
                    ),
                    url(${heroImage})
                    `,

                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
                >
        <Container maxWidth="lg">

          

          {/* TITLE */}
          <Typography
            sx={{
              color: "#f8f8f8",
              fontWeight: 900,
              textAlign: "left",
              fontSize: {
                xs: "40px",
                sm: "60px",
                md: "80px",
              },

              lineHeight: 0.95,
              letterSpacing: "-4px",
              mb: 4,
            }}
          >
           
            Why grow with our technology?
          </Typography>

          {/* DESCRIPTION */}
          <Typography
            sx={{
              color: "rgba(255, 255, 255, 0.89)",

              fontSize: {
                xs: "18px",
                md: "24px",
              },

               textAlign: "left",
              maxWidth: "760px",
              lineHeight: 1.9,
              mb: 5,
            }}
          >
            TechAgro is transforming traditional farming with
            smart agriculture technologies, IoT solutions,
            innovative farming products, and sustainable digital
            services designed for modern farmers.
          </Typography>

          {/* BUTTONS */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            

            <Button
  component={Link}
  to="/about"
  variant="outlined"
  sx={{
    borderColor: "rgba(255, 255, 255, 0.8)",
    color: "#fff",

    px: 4,
    py: 1.8,

    borderRadius: "16px",

    textTransform: "none",

    "&:hover": {
      borderColor: "#fff",
      background: "rgba(255, 255, 255, 0.56)",
    },
  }}
>
  About Us
</Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default AboutUs;