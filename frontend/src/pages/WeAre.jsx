
import React from "react";
import Navbar from "../components/Navbar";

import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  Button,
  Avatar,
} from "@mui/material";

import AgricultureIcon from "@mui/icons-material/Agriculture";
import GroupsIcon from "@mui/icons-material/Groups";
import EmojiNatureIcon from "@mui/icons-material/EmojiNature";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

function About() {
  return (
    <Box sx={{ background: "#f5f7f2" }}>
      <Navbar />

      {/* HERO SECTION */}
      <Box
        sx={{
          position: "relative",
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.55)), url('https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=2070&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Container maxWidth="lg">
          <Typography
            sx={{
              color: "#fff",
              fontWeight: 900,
              fontSize: { xs: "52px", md: "88px" },
              lineHeight: 0.95,
              mb: 3,
              letterSpacing: "-3px",
            }}
          >
            About
            <br />
            TechAgro
          </Typography>

          <Typography
            sx={{
              color: "rgba(255,255,255,0.78)",
              fontSize: { xs: "18px", md: "24px" },
              maxWidth: "700px",
              lineHeight: 1.8,
            }}
          >
            Empowering modern agriculture with smart technology,
            innovative farming products, and digital solutions designed
            to improve productivity and sustainability.
          </Typography>
        </Container>
      </Box>

      {/* COMPANY SECTION */}
      <Container maxWidth="lg" sx={{ py: 12 }}>
        <Grid container spacing={6} alignItems="center">
          {/* IMAGE */}
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=2070&auto=format&fit=crop"
              alt="Agriculture"
              sx={{
                width: "100%",
                height: { xs: 350, md: 520 },
                objectFit: "cover",
                borderRadius: "30px",
                boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
              }}
            />
          </Grid>

          {/* TEXT */}
          <Grid item xs={12} md={6}>
            <Typography
              sx={{
                color: "#2e7d32",
                fontWeight: 700,
                mb: 2,
                letterSpacing: "1px",
              }}
            >
              WHO WE ARE
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: "36px", md: "54px" },
                fontWeight: 800,
                lineHeight: 1.1,
                color: "#111",
                mb: 3,
              }}
            >
              Smart Solutions for Modern Farming
            </Typography>

            <Typography
              sx={{
                color: "#555",
                fontSize: "18px",
                lineHeight: 1.9,
                mb: 4,
              }}
            >
              TechAgro is a smart agriculture platform focused on helping
              farmers increase efficiency and crop productivity through
              advanced technologies. We provide IoT-based farming tools,
              smart irrigation systems, sensor monitoring, and digital
              agricultural services.
            </Typography>

            <Button
              sx={{
                background:
                  "linear-gradient(135deg,#4caf50,#2e7d32)",
                color: "#fff",
                px: 4,
                py: 1.6,
                borderRadius: "16px",
                fontWeight: 700,
                textTransform: "none",

                '&:hover': {
                  background:
                    "linear-gradient(135deg,#43a047,#1b5e20)",
                },
              }}
            >
              Learn More
            </Button>
          </Grid>
        </Grid>
      </Container>

      {/* FEATURES */}
      <Box
        sx={{
          py: 12,
          background:
            "linear-gradient(180deg,#ffffff 0%, #eef6ef 100%)",
        }}
      >
        <Container maxWidth="lg">
          <Typography
            sx={{
              textAlign: "center",
              fontSize: { xs: "38px", md: "58px" },
              fontWeight: 800,
              color: "#111",
              mb: 2,
            }}
          >
            Why Choose Us
          </Typography>

          <Typography
            sx={{
              textAlign: "center",
              color: "#666",
              maxWidth: "700px",
              mx: "auto",
              mb: 8,
              lineHeight: 1.8,
            }}
          >
            We combine innovation, sustainability, and digital technology
            to create powerful agricultural solutions for the future.
          </Typography>

          <Grid container spacing={4}>
            {[
              {
                icon: <AgricultureIcon sx={{ fontSize: 45 }} />,
                title: "Smart Farming",
                desc: "Advanced digital agriculture solutions designed for modern farmers.",
              },
              {
                icon: <EmojiNatureIcon sx={{ fontSize: 45 }} />,
                title: "Eco Friendly",
                desc: "Sustainable technologies that protect crops and the environment.",
              },
              {
                icon: <TrendingUpIcon sx={{ fontSize: 45 }} />,
                title: "Higher Productivity",
                desc: "Boost crop yields and improve operational efficiency with data-driven systems.",
              },
              {
                icon: <GroupsIcon sx={{ fontSize: 45 }} />,
                title: "Expert Support",
                desc: "Professional guidance and technical support for every farmer.",
              },
            ].map((item, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    height: "100%",
                    borderRadius: "28px",
                    background: "#fff",
                    transition: "0.3s",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",

                    '&:hover': {
                      transform: "translateY(-10px)",
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      background: "#e8f5e9",
                      color: "#2e7d32",
                      mb: 3,
                    }}
                  >
                    {item.icon}
                  </Avatar>

                  <Typography
                    sx={{
                      fontSize: "24px",
                      fontWeight: 700,
                      mb: 2,
                    }}
                  >
                    {item.title}
                  </Typography>

                  <Typography
                    sx={{
                      color: "#666",
                      lineHeight: 1.8,
                    }}
                  >
                    {item.desc}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* STATS SECTION */}
      <Container maxWidth="lg" sx={{ py: 12 }}>
        <Grid container spacing={4}>
          {[
            { number: "10K+", label: "Farmers Supported" },
            { number: "25+", label: "Smart Products" },
            { number: "100%", label: "Eco Friendly Solutions" },
            { number: "24/7", label: "Technical Support" },
          ].map((item, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Paper
                elevation={0}
                sx={{
                  textAlign: "center",
                  p: 4,
                  borderRadius: "24px",
                  background: "#fff",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: "42px", md: "58px" },
                    fontWeight: 900,
                    color: "#2e7d32",
                    mb: 1,
                  }}
                >
                  {item.number}
                </Typography>

                <Typography sx={{ color: "#666" }}>
                  {item.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA SECTION */}
      <Box
        sx={{
          py: 12,
          background:
            "linear-gradient(135deg,#1b5e20,#2e7d32)",
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography
            sx={{
              color: "#fff",
              fontSize: { xs: "42px", md: "68px" },
              fontWeight: 900,
              lineHeight: 1,
              mb: 3,
            }}
          >
            Grow With TechAgro
          </Typography>

          <Typography
            sx={{
              color: "rgba(255,255,255,0.78)",
              fontSize: "20px",
              lineHeight: 1.8,
              mb: 5,
            }}
          >
            Join the future of smart agriculture and transform the way
            farming works with innovative technology.
          </Typography>

          <Button
            sx={{
              background: "#fff",
              color: "#1b5e20",
              px: 5,
              py: 1.8,
              borderRadius: "18px",
              fontWeight: 800,
              textTransform: "none",
              fontSize: "18px",

              '&:hover': {
                background: "#f5f5f5",
              },
            }}
          >
            Contact Us
          </Button>
        </Container>
      </Box>
    </Box>
  );
}

export default About;
