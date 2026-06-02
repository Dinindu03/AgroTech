import React, { useState } from "react";
import Footer from "../components/Footer";
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  Button,
  Avatar,
  TextField,
} from "@mui/material";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";

function About() {
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });


  
  const handleInputChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };



  
  return (
    <Box sx={{ background: "#f9fbf7", minHeight: "100vh" }}>
      
      {/* HERO SECTION WITH VIDEO BACKGROUND */}
      <Box 
  sx={{ 
    position: "relative",
    // 100dvh prevents mobile address bar layout jumps, fallback to 100vh
    height: { xs: "auto", md: "100dvh" },
    minHeight: { xs: "100vh", md: "100vh" },
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    py: { xs: 12, md: 0 },
    width: "100%",
    backgroundColor: "#000", // Smooth dark backdrop color while video is downloading
  }}
>
  {/* 1. Background Video Layer */}
  <video
    autoPlay
    muted
    loop
    playsInline
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      zIndex: 1, // Base layer
    }}
  >
    <source src="/AboutUs.mp4" type="video/mp4" />
  </video>

  {/* 2. Semi-Transparent Dark Overlay Layer */}
  <Box 
    sx={{
      position: "absolute",
      inset: 0,
      background: "linear-gradient(90deg, rgba(0, 0, 0, 0.44) 0%, rgba(0, 0, 0, 0.13) 100%)",
      zIndex: 2, // Sits directly on top of the video
    }}
  />

  {/* 3. Interactive Content Layer */}
  <Container 
  maxWidth="lg" 
  sx={{ 
    position: "relative", 
    zIndex: 3, 
    color: "#ffffff",
    px: { xs: 3, md: 6 } // Adds a bit of clean breathing room on the edges
  }}
>
  {/* Left-aligned Section Header as seen in Screenshot 2026-06-03 010812.jpg */}
  <Typography 
    variant="h1" 
    sx={{ 
      fontSize: { xs: "38px", md: "64px" }, 
      fontWeight: 800, 
      letterSpacing: "-1px",
      mb: 5,
      textAlign: "left", 
      textShadow: "0 2px 10px rgba(0,0,0,0.4)"
    }}
  >
    Who We Are
  </Typography>
  
  {/* Two Column Layout */}
  <Grid container spacing={{ xs: 4, md: 8 }}>
    
    {/* Paragraph 1 - Left Side */}
    <Grid item xs={12} md={6}>
      <Typography 
        variant="body1" 
        sx={{ 
          color: "rgba(255,255,255,0.95)", 
          fontWeight: 400, 
          lineHeight: 1.6, 
          fontSize: { xs: "16px", md: "18px" },
          textAlign: "left",
          textShadow: "0 2px 8px rgba(0,0,0,0.4)"
        }}
      >
        An industry pioneer in digital innovation and sustainable farming, TechAgro is one of the leading agritech companies in Sri Lanka and a dominant player in the modern agricultural sector. We offer a comprehensive suite of smart solutions and analytical services to both local and export markets. Sri Lankan farmers and modern agro-enterprises benefit from our diverse portfolio of next-generation agri-solutions. This includes smart monitoring systems, IoT-driven soil and crop sensors, precision automation hardware, and eco-friendly agricultural inputs designed to maximize yield while minimizing environmental impact.
      </Typography>
    </Grid>

    {/* Paragraph 2 - Right Side */}
    <Grid item xs={12} md={6}>
      <Typography 
        variant="body1" 
        sx={{ 
          color: "rgba(255,255,255,0.95)", 
          fontWeight: 400, 
          lineHeight: 1.6, 
          fontSize: { xs: "16px", md: "18px" },
          textAlign: "left",
          textShadow: "0 2px 8px rgba(0,0,0,0.4)",
          mb: 3 // Adds a small gap before the final block
        }}
      >
        As a primary driver of modern supply chain optimization, we maintain an extensive, digitally connected farmer outgrower network across the island, streamlining the path from field to market. Our engineering and data facilities utilize state-of-the-art tech stacks to provide predictive crop analytics, automated disease detection, and climate-smart agricultural frameworks through advanced machine learning algorithms.
      </Typography>

      <Typography 
        variant="body1" 
        sx={{ 
          color: "rgba(255,255,255,0.95)", 
          fontWeight: 400, 
          lineHeight: 1.6, 
          fontSize: { xs: "16px", md: "18px" },
          textAlign: "left",
          textShadow: "0 2px 8px rgba(0,0,0,0.4)"
        }}
      >
        Committed to knowledge-sharing, the TechAgro Innovation Hub (TAIH) serves as a premier training foundation, offering specialized certifications in smart-farming inputs, drone data mapping, and agricultural technology integration to empower the next generation of digital agri-entrepreneurs.
      </Typography>
    </Grid>

  </Grid>
</Container>
</Box>

      {/* MISSION & VISION */}
      <Box sx={{ py: 12, background: "#fff"  , position: "center",}}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 5,
                  borderRadius: "24px",
                  height: "100%",
                  background: "linear-gradient(135deg, #2e7d32, #1b5e20)",
                  color: "#fff",
                  boxShadow: "0 12px 40px rgba(46,125,50,0.25)"
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                  Our Mission
                </Typography>
                <Typography sx={{ lineHeight: 1.8, fontSize: "16px", color: "rgba(255,255,255,0.9)" }}>
                  To empower farmers through innovative agricultural technologies, smart monitoring systems, and
                  sustainable solutions that improve productivity, profitability, and environmental responsibility.
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 5,
                  borderRadius: "24px",
                  height: "100%",
                  background: "#f4f7f2",
                  border: "1px solid rgba(46,125,50,0.1)"
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: "#2e7d32" }}>
                  Our Vision
                </Typography>
                <Typography sx={{ lineHeight: 1.8, fontSize: "16px", color: "#555" }}>
                  To become the leading digital agriculture platform that transforms farming through technology, data,
                  and innovation while creating a sustainable future for global agriculture.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* STATS SECTION */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={3}>
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
                  p: 3,
                  borderRadius: "20px",
                  background: "#fff",
                  border: "1px solid #eef2ea",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
                }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: "32px", md: "44px" },
                    fontWeight: 800,
                    color: "#2e7d32",
                    mb: 0.5,
                  }}
                >
                  {item.number}
                </Typography>
                <Typography sx={{ color: "#666", fontSize: "14px", fontWeight: 500 }}>
                  {item.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* BOARD MEMBERS */}
      <Box sx={{ py: 12, background: "#fdfefe" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, color: "#111" }}>
              Leadership Team
            </Typography>
            <Typography sx={{ color: "#666", fontSize: "18px" }}>
              Meet the minds driving agricultural innovation at TechAgro.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {[
              {
                name: "John Fernando",
                role: "Chief Executive Officer",
                img: "https://randomuser.me/api/portraits/men/32.jpg",
              },
              {
                name: "Sarah Perera",
                role: "Chief Technology Officer",
                img: "https://randomuser.me/api/portraits/women/44.jpg",
              },
              {
                name: "David Silva",
                role: "Operations Director",
                img: "https://randomuser.me/api/portraits/men/52.jpg",
              },
            ].map((member, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    borderRadius: "24px",
                    textAlign: "center",
                    background: "#fff",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
                    border: "1px solid #f0f4ee",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "0 15px 40px rgba(46,125,50,0.1)",
                    },
                  }}
                >
                  <Avatar
                    src={member.img}
                    sx={{
                      width: 110,
                      height: 110,
                      mx: "auto",
                      mb: 3,
                      boxShadow: "0 8px 20px rgba(0,0,0,0.1)"
                    }}
                  />
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {member.name}
                  </Typography>
                  <Typography sx={{ color: "#2e7d32", fontWeight: 500, fontSize: "15px" }}>
                    {member.role}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CAREERS */}
      <Box sx={{ py: 8, background: "#fff" }}>
        <Container maxWidth="lg">
          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, md: 8 },
              borderRadius: "32px",
              textAlign: "center",
              background: "linear-gradient(135deg, #f1f8e9 0%, #e8f5e9 100%)",
              border: "1px solid rgba(46,125,50,0.08)"
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, color: "#1b5e20" }}>
              Grow Your Career With Us
            </Typography>
            <Typography sx={{ color: "#555", maxWidth: "650px", mx: "auto", lineHeight: 1.8, mb: 4 }}>
              We are looking for talented developers, agricultural experts, and innovators who are passionate about transforming ecosystem production through intelligence systems.
            </Typography>
            <Button
              variant="contained"
              sx={{
                background: "#2e7d32",
                color: "#fff",
                px: 5,
                py: 1.8,
                borderRadius: "12px",
                fontWeight: 600,
                textTransform: "none",
                fontSize: "16px",
                boxShadow: "0 8px 24px rgba(46,125,50,0.25)",
                "&:hover": {
                  background: "#1b5e20",
                },
              }}
            >
              View Open Positions
            </Button>
          </Paper>
        </Container>
      </Box>

      {/* CONTACT & MESSAGE SECTION */}
      <Box sx={{ py: 12, background: "#f9fbf7" }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            
            {/* Left Column: Contact info details */}
            <Grid item xs={12} md={5}>
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 3, color: "#111" }}>
                Get In Touch
              </Typography>
              <Typography sx={{ color: "#666", mb: 5, lineHeight: 1.7 }}>
                Have inquiries about our enterprise architecture configurations or custom smart integrations? Reach out directly to our help desks.
              </Typography>

              {[
                { icon: <LocationOnIcon />, title: "Main Office", value: "No. 25, Colombo Road, Negombo, Sri Lanka" },
                { icon: <EmailIcon />, title: "Email Support", value: "info@techagro.com" },
                { icon: <PhoneIcon />, title: "Call Hub", value: "+94 77 123 4567" }
              ].map((item, idx) => (
                <Box key={idx} sx={{ display: "flex", mb: 4, alignItems: "flex-start" }}>
                  <Box sx={{ color: "#2e7d32", mr: 2.5, mt: 0.5 }}>
                    {item.icon}
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#333" }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      {item.value}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Grid>

            {/* Right Column: Dynamic Form */}
            <Grid item xs={12} md={7}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: { xs: 4, md: 5 }, 
                  borderRadius: "24px", 
                  background: "#fff", 
                  boxShadow: "0 12px 40px rgba(0,0,0,0.04)",
                  border: "1px solid #f0f4ee"
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                  Send Us a Message
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Your Name" name="name" variant="outlined" onChange={handleInputChange} sx={{ background: "#fafafa" }} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Email Address" name="email" variant="outlined" onChange={handleInputChange} sx={{ background: "#fafafa" }} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Message" name="message" variant="outlined" multiline rows={4} onChange={handleInputChange} sx={{ background: "#fafafa" }} />
                  </Grid>
                  <Grid item xs={12}>
                    <Button 
                      fullWidth 
                      variant="contained" 
                      sx={{ 
                        py: 1.8, 
                        background: "#2e7d32", 
                        borderRadius: "12px", 
                        textTransform: "none", 
                        fontSize: "16px",
                        fontWeight: 600,
                        "&:hover": { background: "#1b5e20" } 
                      }}
                    >
                      Submit Message
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

          </Grid>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}

export default About;