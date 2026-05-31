import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  IconButton,
} from "@mui/material";

import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const Footer = () => {
  return (
    <Box
      id="contact"
      sx={{
        fontSize: "14px",
  fontWeight: 800,
        background:
          "linear-gradient(135deg, #c9fed884, #4095465a, #1b641e)",
        color: "#000000",
        py:2,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand */}
          <Grid item xs={12} md={6}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                mb: 1,
              }}
            >
              🌿 TechAgro
            </Typography>

            <Typography
              sx={{
                color: "rgba(14, 14, 14, 0.85)",
                lineHeight: 1.8,
                 fontSize: "12px",
                maxWidth: "450px",
              }}
            >
              Smart Agriculture Management System for Sustainable Farming.
            </Typography>
             <Typography
            variant="body2"
            sx={{
              color: "rgba(22, 21, 21, 0.7)",
            }}
          >
            © {new Date().getFullYear()} TechAgro. All Rights Reserved.
          </Typography>
          </Grid>

          {/* Contact */}
          <Grid item xs={12} md={3}>
            <Typography
              sx={{
                fontWeight: "bold",
                mb: 2,
                color: "#413f3f",
              }}
            >
              Contact Us
            </Typography>

            <Box sx={{ display: "flex",fontSize: "12px", mb: 1 }}>
              <EmailIcon sx={{ mr: 1, fontSize: 12 }} />
              <Typography variant="body2">
                info@techagro.com
              </Typography>
            </Box>

            <Box sx={{ display: "flex",fontSize: "12px", mb: 1 }}>
              <PhoneIcon sx={{ mr: 1, fontSize: 12}} />
              <Typography variant="body2">
                +94 77 123 4567
              </Typography>
            </Box>

            <Box sx={{ display: "flex",fontSize: "12px" }}>
              <LocationOnIcon sx={{ mr: 1, fontSize: 12 }} />
              <Typography variant="body2">
                Colombo, Sri Lanka
              </Typography>
            </Box>
          </Grid>

          {/* Social Media */}
          <Grid item xs={12} md={3}>
            <Typography
              sx={{
                fontWeight: "bold",
                mb: 2,
                fontSize: "12px",
                color: "#C8E6C9",
              }}
            >
              Follow Us
            </Typography>

            <Box>
              <IconButton
                sx={{
                  color: "#fff",
                  bgcolor: "rgba(255,255,255,0.12)",
                  mr: 1,
                  "&:hover": {
                    bgcolor: "#fff",
                    color: "#1b5e20",
                  },
                }}
              >
                <FacebookIcon />
              </IconButton>

              <IconButton
                sx={{
                  color: "#fff",
                  bgcolor: "rgba(255,255,255,0.12)",
                  mr: 1,
                  "&:hover": {
                    bgcolor: "#fff",
                    color: "#1b5e20",
                  },
                }}
              >
                <InstagramIcon />
              </IconButton>

              <IconButton
                sx={{
                  color: "#fff",
                  bgcolor: "rgba(255,255,255,0.12)",
                  "&:hover": {
                    bgcolor: "#fff",
                    color: "#1b5e20",
                  },
                }}
              >
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

   
      
      </Container>
    </Box>
  );
};

export default Footer;