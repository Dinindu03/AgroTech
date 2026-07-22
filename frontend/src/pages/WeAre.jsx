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
  GlobalStyles,
} from "@mui/material";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import GrassIcon from "@mui/icons-material/Grass";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import SsidChartIcon from "@mui/icons-material/SsidChart";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";

/* ---------------------------------------------------------------
   DESIGN TOKENS — "Field & Ledger"
   A working-farm palette (deep moss, soil, harvest gold) paired
   with a data/instrument accent, since AgroTech sells both soil
   and sensors. Display type uses a system serif stack (reads
   organic, not manufactured). Body/labels use the system UI font
   stack and a system monospace stack for the data/instrument feel.
   No external font or image requests — everything resolves from
   fonts already installed on the device, so this works fully
   offline.
------------------------------------------------------------------ */
const fontDisplay = "Georgia, 'Iowan Old Style', 'Palatino Linotype', Palatino, serif";
const fontMono =
  "'SFMono-Regular', 'Consolas', 'Liberation Mono', Menlo, Monaco, monospace";
const c = {
  moss: "#16301F",      // deep moss — primary dark ground
  mossMid: "#25492F",
  sage: "#7FA06B",       // living leaf accent
  gold: "#D9A441",       // harvest gold accent
  goldDeep: "#B8842B",
  soil: "#5B3E2B",       // soil brown for grounding text/rules
  paper: "#F7F5EC",      // warm paper background (rice/husk tone)
  paperDeep: "#EFEBDC",
  ink: "#1C2A1E",        // near-black green body text
  mist: "#EDEFE6",
};

/* Furrow divider — a signature motif standing in for plowed field
   rows / contour terracing, used as the seam between sections
   instead of a flat hairline. */
function FurrowDivider({ fill = c.paper, flip = false }) {
  return (
    <Box
      component="svg"
      viewBox="0 0 1440 64"
      preserveAspectRatio="none"
      sx={{
        display: "block",
        width: "100%",
        height: { xs: 32, md: 56 },
        transform: flip ? "scaleY(-1)" : "none",
      }}
    >
      <path
        d="M0,32 C 120,4 240,4 360,32 C 480,60 600,60 720,32 C 840,4 960,4 1080,32 C 1200,60 1320,60 1440,32 L1440,64 L0,64 Z"
        fill={fill}
      />
    </Box>
  );
}

function About() {
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });

  const handleInputChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  return (
    <Box sx={{ background: c.paper, minHeight: "100vh" }}>
      <GlobalStyles
        styles={{
          ".at-eyebrow": {
            fontFamily: fontMono,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            fontWeight: 600,
          },
          ".at-display": {
            fontFamily: fontDisplay,
          },
        }}
      />

      {/* ============================================================ */}
      {/* HERO — VIDEO BACKGROUND                                       */}
      {/* ============================================================ */}
      <Box
        sx={{
          position: "relative",
          height: { xs: "auto", md: "100dvh" },
          minHeight: { xs: "100vh", md: "100vh" },
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: { xs: 12, md: 0 },
          width: "100%",
          backgroundColor: c.moss,
        }}
      >
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
            zIndex: 1,
          }}
        >
          <source src="/AboutUs.mp4" type="video/mp4" />
        </video>

        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(100deg, rgba(22,48,31,0.82) 0%, rgba(22,48,31,0.5) 46%, rgba(22,48,31,0.25) 100%)",
            zIndex: 2,
          }}
        />

        <Container
          maxWidth="lg"
          sx={{ position: "relative", zIndex: 3, color: "#fff", px: { xs: 3, md: 6 } }}
        >
          <Box
            className="at-eyebrow"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              color: c.gold,
              fontSize: "12.5px",
              mb: 3,
              border: `1px solid rgba(217,164,65,0.5)`,
              borderRadius: "999px",
              px: 2,
              py: 0.7,
            }}
          >
            <GrassIcon sx={{ fontSize: 15 }} />
            Field-tested across Sri Lanka since day one
          </Box>

          <Typography
            className="at-display"
            variant="h1"
            sx={{
              fontSize: { xs: "40px", md: "76px" },
              fontWeight: 600,
              letterSpacing: "-1.5px",
              lineHeight: 1.02,
              mb: 5,
              textAlign: "left",
              maxWidth: "780px",
            }}
          >
            Who we are
          </Typography>

          <Grid container spacing={{ xs: 4, md: 8 }}>
            <Grid item xs={12} md={6}>
              <Typography
                sx={{
                  color: "rgba(255,255,255,0.92)",
                  fontWeight: 400,
                  lineHeight: 1.65,
                  fontSize: { xs: "15.5px", md: "17px" },
                  textAlign: "left",
                }}
              >
                An industry pioneer in digital innovation and sustainable farming, AgroTech is one
                of the leading agritech companies in Sri Lanka and a dominant player in the modern
                agricultural sector. We offer a comprehensive suite of smart solutions and
                analytical services to both local and export markets. Sri Lankan farmers and
                modern agro-enterprises benefit from our diverse portfolio of next-generation
                agri-solutions — smart monitoring systems, IoT-driven soil and crop sensors,
                precision automation hardware, and eco-friendly agricultural inputs designed to
                maximize yield while minimizing environmental impact.
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography
                sx={{
                  color: "rgba(255,255,255,0.92)",
                  fontWeight: 400,
                  lineHeight: 1.65,
                  fontSize: { xs: "15.5px", md: "17px" },
                  textAlign: "left",
                  mb: 3,
                }}
              >
                As a primary driver of modern supply chain optimization, we maintain an extensive,
                digitally connected farmer outgrower network across the island, streamlining the
                path from field to market. Our engineering and data facilities utilize
                state-of-the-art tech stacks to provide predictive crop analytics, automated
                disease detection, and climate-smart agricultural frameworks through advanced
                machine learning algorithms.
              </Typography>

              <Typography
                sx={{
                  color: "rgba(255,255,255,0.92)",
                  fontWeight: 400,
                  lineHeight: 1.65,
                  fontSize: { xs: "15.5px", md: "17px" },
                  textAlign: "left",
                }}
              >
                Committed to knowledge-sharing, the AgroTech Innovation Hub (TAIH) serves as a
                premier training foundation, offering specialized certifications in smart-farming
                inputs, drone data mapping, and agricultural technology integration to empower the
                next generation of digital agri-entrepreneurs.
              </Typography>
            </Grid>
          </Grid>
        </Container>

        <Box sx={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 3, lineHeight: 0 }}>
          <FurrowDivider fill={c.paper} />
        </Box>
      </Box>

      {/* ============================================================ */}
      {/* MISSION & VISION                                              */}
      {/* ============================================================ */}
      <Box sx={{ pt: { xs: 8, md: 10 }, pb: 12, background: c.paper }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 5,
                  borderRadius: "28px 28px 28px 6px",
                  height: "100%",
                  background: `linear-gradient(150deg, ${c.mossMid}, ${c.moss})`,
                  color: "#fff",
                  boxShadow: "0 16px 40px rgba(22,48,31,0.22)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <WaterDropIcon
                  sx={{ position: "absolute", top: 20, right: 20, fontSize: 90, color: "rgba(255,255,255,0.06)" }}
                />
                <Box className="at-eyebrow" sx={{ color: c.gold, fontSize: "11.5px", mb: 1.5 }}>
                  01 — Purpose
                </Box>
                <Typography className="at-display" variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
                  Our Mission
                </Typography>
                <Typography sx={{ lineHeight: 1.8, fontSize: "16px", color: "rgba(255,255,255,0.88)" }}>
                  To empower farmers through innovative agricultural technologies, smart
                  monitoring systems, and sustainable solutions that improve productivity,
                  profitability, and environmental responsibility.
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 5,
                  borderRadius: "28px 28px 6px 28px",
                  height: "100%",
                  background: c.mist,
                  border: `1px solid ${c.paperDeep}`,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <WbSunnyIcon
                  sx={{ position: "absolute", top: 20, right: 20, fontSize: 90, color: "rgba(22,48,31,0.05)" }}
                />
                <Box className="at-eyebrow" sx={{ color: c.goldDeep, fontSize: "11.5px", mb: 1.5 }}>
                  02 — Direction
                </Box>
                <Typography className="at-display" variant="h4" sx={{ fontWeight: 600, mb: 2, color: c.moss }}>
                  Our Vision
                </Typography>
                <Typography sx={{ lineHeight: 1.8, fontSize: "16px", color: c.soil }}>
                  To become the leading digital agriculture platform that transforms farming
                  through technology, data, and innovation while creating a sustainable future for
                  global agriculture.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ============================================================ */}
      {/* STATS — FIELD READOUT                                         */}
      {/* ============================================================ */}
      <Box sx={{ background: c.moss, py: { xs: 7, md: 8 } }}>
        <Container maxWidth="lg">
          <Box
            className="at-eyebrow"
            sx={{ color: c.sage, fontSize: "11.5px", mb: 4, textAlign: { xs: "left" } }}
          >
            Live from the network
          </Box>
          <Grid container spacing={{ xs: 4, md: 2 }}>
            {[
              { number: "10K+", label: "Farmers supported", icon: <GrassIcon /> },
              { number: "25+", label: "Smart products", icon: <SsidChartIcon /> },
              { number: "100%", label: "Eco-friendly inputs", icon: <WaterDropIcon /> },
              { number: "24/7", label: "Technical support", icon: <WbSunnyIcon /> },
            ].map((item, index) => (
              <Grid
                item
                xs={6}
                md={3}
                key={index}
                sx={{
                  borderLeft: { md: index !== 0 ? "1px solid rgba(255,255,255,0.12)" : "none" },
                  pl: { md: index !== 0 ? 4 : 0 },
                }}
              >
                <Box sx={{ color: c.gold, mb: 1.5 }}>{item.icon}</Box>
                <Typography
                  className="at-display"
                  sx={{
                    fontSize: { xs: "34px", md: "46px" },
                    fontWeight: 600,
                    color: "#fff",
                    lineHeight: 1,
                    mb: 0.75,
                  }}
                >
                  {item.number}
                </Typography>
                <Typography
                  className="at-eyebrow"
                  sx={{ color: "rgba(255,255,255,0.55)", fontSize: "11px" }}
                >
                  {item.label}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ============================================================ */}
      {/* BOARD MEMBERS                                                 */}
      {/* ============================================================ */}
      <Box sx={{ py: 12, background: c.paper }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 8, maxWidth: 560 }}>
            <Box className="at-eyebrow" sx={{ color: c.goldDeep, fontSize: "11.5px", mb: 1.5 }}>
              The people
            </Box>
            <Typography className="at-display" variant="h3" sx={{ fontWeight: 600, mb: 2, color: c.ink }}>
              Leadership Team
            </Typography>
            <Typography sx={{ color: c.soil, fontSize: "16px", lineHeight: 1.7 }}>
              Meet the minds driving agricultural innovation at AgroTech.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {[
              {
                name: "Dinindu Arachchige",
                role: "Chief Executive Officer",
                initials: "DA",
              },
              {
                name: "Sarah Perera",
                role: "Chief Technology Officer",
                initials: "SP",
              },
              {
                name: "David Silva",
                role: "Operations Director",
                initials: "DS",
              },
            ].map((member, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    borderRadius: "22px",
                    textAlign: "left",
                    background: "#fff",
                    boxShadow: "0 10px 30px rgba(22,48,31,0.05)",
                    border: `1px solid ${c.paperDeep}`,
                    transition: "all 0.25s ease",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "0 18px 40px rgba(22,48,31,0.12)",
                      borderColor: c.sage,
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 96,
                      height: 96,
                      mb: 3,
                      border: `3px solid ${c.mist}`,
                      boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
                      background: `linear-gradient(150deg, ${c.mossMid}, ${c.moss})`,
                      color: c.gold,
                      fontFamily: fontDisplay,
                      fontSize: "28px",
                      fontWeight: 600,
                    }}
                  >
                    {member.initials}
                  </Avatar>
                  <Typography className="at-display" variant="h5" sx={{ fontWeight: 600, mb: 0.5, color: c.ink }}>
                    {member.name}
                  </Typography>
                  <Typography className="at-eyebrow" sx={{ color: c.goldDeep, fontSize: "11.5px" }}>
                    {member.role}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ============================================================ */}
      {/* CAREERS                                                       */}
      {/* ============================================================ */}
      <Box sx={{ pb: 12, background: c.paper }}>
        <Container maxWidth="lg">
          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, md: 8 },
              borderRadius: "32px",
              textAlign: "left",
              background: `linear-gradient(120deg, ${c.moss} 0%, ${c.mossMid} 100%)`,
              position: "relative",
              overflow: "hidden",
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { md: "center" },
              justifyContent: "space-between",
              gap: 4,
            }}
          >
            <GrassIcon sx={{ position: "absolute", right: -20, bottom: -30, fontSize: 220, color: "rgba(255,255,255,0.04)" }} />
            <Box sx={{ maxWidth: 620, position: "relative", zIndex: 1 }}>
              <Box className="at-eyebrow" sx={{ color: c.gold, fontSize: "11.5px", mb: 1.5 }}>
                We're hiring
              </Box>
              <Typography className="at-display" variant="h3" sx={{ fontWeight: 600, mb: 2, color: "#fff" }}>
                Grow your career with us
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.82)", lineHeight: 1.8 }}>
                We are looking for talented developers, agricultural experts, and innovators who
                are passionate about transforming ecosystem production through intelligence
                systems.
              </Typography>
            </Box>
            <Button
              variant="contained"
              endIcon={<ArrowOutwardIcon />}
              sx={{
                background: c.gold,
                color: c.moss,
                px: 4,
                py: 1.6,
                borderRadius: "12px",
                fontWeight: 700,
                textTransform: "none",
                fontSize: "16px",
                whiteSpace: "nowrap",
                position: "relative",
                zIndex: 1,
                boxShadow: "0 8px 24px rgba(217,164,65,0.3)",
                "&:hover": { background: c.goldDeep, color: "#fff" },
              }}
            >
              View open positions
            </Button>
          </Paper>
        </Container>
      </Box>

      {/* ============================================================ */}
      {/* CONTACT & MESSAGE                                             */}
      {/* ============================================================ */}
      <Box sx={{ background: c.mist }}>
        <FurrowDivider fill={c.mist} flip />
        <Box sx={{ pb: 12 }}>
          <Container maxWidth="lg">
            <Grid container spacing={6} alignItems="center">
              <Grid item xs={12} md={5}>
                <Box className="at-eyebrow" sx={{ color: c.goldDeep, fontSize: "11.5px", mb: 1.5 }}>
                  Reach us
                </Box>
                <Typography className="at-display" variant="h3" sx={{ fontWeight: 600, mb: 3, color: c.ink }}>
                  Get in touch
                </Typography>
                <Typography sx={{ color: c.soil, mb: 5, lineHeight: 1.7 }}>
                  Have inquiries about our enterprise architecture configurations or custom smart
                  integrations? Reach out directly to our help desks.
                </Typography>

                {[
                  { icon: <LocationOnIcon />, title: "Main Office", value: "No. 25, Colombo Road, Negombo, Sri Lanka" },
                  { icon: <EmailIcon />, title: "Email Support", value: "info@agrotech.com" },
                  { icon: <PhoneIcon />, title: "Call Hub", value: "+94 77 123 4567" },
                ].map((item, idx) => (
                  <Box key={idx} sx={{ display: "flex", mb: 4, alignItems: "flex-start" }}>
                    <Box
                      sx={{
                        color: c.moss,
                        mr: 2.5,
                        width: 42,
                        height: 42,
                        borderRadius: "12px",
                        background: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        border: `1px solid ${c.paperDeep}`,
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: c.ink }}>
                        {item.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: c.soil }}>
                        {item.value}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Grid>

              <Grid item xs={12} md={7}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 4, md: 5 },
                    borderRadius: "24px",
                    background: "#fff",
                    boxShadow: "0 12px 40px rgba(22,48,31,0.06)",
                    border: `1px solid ${c.paperDeep}`,
                  }}
                >
                  <Typography className="at-display" variant="h5" sx={{ fontWeight: 600, mb: 3, color: c.ink }}>
                    Send us a message
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Your Name"
                        name="name"
                        variant="outlined"
                        onChange={handleInputChange}
                        sx={{ background: c.paper }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        variant="outlined"
                        onChange={handleInputChange}
                        sx={{ background: c.paper }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Message"
                        name="message"
                        variant="outlined"
                        multiline
                        rows={4}
                        onChange={handleInputChange}
                        sx={{ background: c.paper }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        fullWidth
                        variant="contained"
                        sx={{
                          py: 1.8,
                          background: c.moss,
                          borderRadius: "12px",
                          textTransform: "none",
                          fontSize: "16px",
                          fontWeight: 600,
                          "&:hover": { background: c.mossMid },
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
      </Box>

     
    </Box>
  );
}

export default About;