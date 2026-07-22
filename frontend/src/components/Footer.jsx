import React from "react";
import { Box, Container, Typography, Grid, IconButton, Divider } from "@mui/material";

import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import GrassIcon from "@mui/icons-material/Grass";

/* ---------------------------------------------------------------
   Shared with About.jsx — "Field & Ledger" tokens.
   NOTE: these are duplicated here since there's no shared theme
   file yet. If you add one (e.g. src/theme/tokens.js), import
   from there instead so Footer and About never drift apart.
   No external font/image requests — safe for offline use.
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

/* Same furrow motif used at the seams on About.jsx, here used to
   stitch the footer onto whatever section sits above it. */
function FurrowDivider({ fill = c.moss }) {
  return (
    <Box
      component="svg"
      viewBox="0 0 1440 64"
      preserveAspectRatio="none"
      sx={{ display: "block", width: "100%", height: { xs: 28, md: 48 } }}
    >
      <path
        d="M0,32 C 120,4 240,4 360,32 C 480,60 600,60 720,32 C 840,4 960,4 1080,32 C 1200,60 1320,60 1440,32 L1440,64 L0,64 Z"
        fill={fill}
      />
    </Box>
  );
}

const socialLinks = [
  { icon: <FacebookIcon fontSize="small" />, label: "Facebook", href: "#" },
  { icon: <InstagramIcon fontSize="small" />, label: "Instagram", href: "#" },
  { icon: <LinkedInIcon fontSize="small" />, label: "LinkedIn", href: "#" },
];

const contactLines = [
  { icon: <EmailIcon sx={{ fontSize: 16 }} />, value: "info@agrotech.com" },
  { icon: <PhoneIcon sx={{ fontSize: 16 }} />, value: "+94 77 123 4567" },
  { icon: <LocationOnIcon sx={{ fontSize: 16 }} />, value: "Colombo, Sri Lanka" },
];

const Footer = () => {
  return (
    <Box id="contact" component="footer" sx={{ background: c.moss }}>
      <FurrowDivider fill={c.moss} />

      <Container maxWidth="lg" sx={{ pb: 6 }}>
        <Grid container spacing={{ xs: 5, md: 4 }}>
          {/* Brand */}
          <Grid item xs={12} md={5}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: "9px",
                  background: c.gold,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <GrassIcon sx={{ fontSize: 19, color: c.moss }} />
              </Box>
              <Typography
                sx={{ fontFamily: fontDisplay, fontWeight: 600, fontSize: "22px", color: "#fff" }}
              >
                AgroTech
              </Typography>
            </Box>

            <Typography
              sx={{
                color: "rgba(255,255,255,0.65)",
                lineHeight: 1.8,
                fontSize: "14px",
                maxWidth: "380px",
                mb: 3,
              }}
            >
              Smart agriculture management system for sustainable farming — built for Sri Lanka's
              growers, from soil to supply chain.
            </Typography>

            <Box sx={{ display: "flex", gap: 1 }}>
              {socialLinks.map((s, idx) => (
                <IconButton
                  key={idx}
                  aria-label={s.label}
                  href={s.href}
                  size="small"
                  sx={{
                    color: c.gold,
                    bgcolor: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    "&:hover": {
                      bgcolor: c.gold,
                      color: c.moss,
                      borderColor: c.gold,
                    },
                  }}
                >
                  {s.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Contact */}
          <Grid item xs={6} md={3.5}>
            <Typography
              sx={{
                fontFamily: fontMono,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                fontSize: "11px",
                fontWeight: 600,
                color: c.sage,
                mb: 2.5,
              }}
            >
              Contact
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {contactLines.map((item, idx) => (
                <Box key={idx} sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                  <Box sx={{ color: c.gold, display: "flex" }}>{item.icon}</Box>
                  <Typography sx={{ fontSize: "13.5px", color: "rgba(255,255,255,0.75)" }}>
                    {item.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Quick links */}
          <Grid item xs={6} md={3.5}>
            <Typography
              sx={{
                fontFamily: fontMono,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                fontSize: "11px",
                fontWeight: 600,
                color: c.sage,
                mb: 2.5,
              }}
            >
              Company
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
              {["About us", "Smart products", "Careers", "Support"].map((label, idx) => (
                <Typography
                  key={idx}
                  component="a"
                  href="#"
                  sx={{
                    fontSize: "13.5px",
                    color: "rgba(255,255,255,0.75)",
                    textDecoration: "none",
                    width: "fit-content",
                    "&:hover": { color: c.gold },
                  }}
                >
                  {label}
                </Typography>
              ))}
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", my: 4 }} />

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: 1.5,
          }}
        >
          <Typography sx={{ fontSize: "12.5px", color: "rgba(255,255,255,0.5)" }}>
            © {new Date().getFullYear()} AgroTech. All rights reserved.
          </Typography>
          <Typography
            sx={{
              fontFamily: fontMono,
              fontSize: "11px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.35)",
            }}
          >
            Grown in Sri Lanka
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;