import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import GrassOutlinedIcon from "@mui/icons-material/GrassOutlined";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import BugReportOutlinedIcon from "@mui/icons-material/BugReportOutlined";
import WaterDropOutlinedIcon from "@mui/icons-material/WaterDropOutlined";
import SensorsOutlinedIcon from "@mui/icons-material/SensorsOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";

// ── Palette — same green/gold system as About / KnowledgeHub teaser ──
const c = {
  moss: "#16301F",
  mossMid: "#25492F",
  mossDeep: "#0E2016",
  sage: "#7FA06B",
  gold: "#D9A441",
  goldDeep: "#B8842B",
  paper: "#F7F5EC",
  paperDeep: "#EFEBDC",
  ink: "#1C2A1E",
  soil: "#5B3E2B",
};

const fontDisplay = "Georgia, 'Iowan Old Style', 'Palatino Linotype', Palatino, serif";
const fontMono = "'SFMono-Regular', 'Consolas', 'Liberation Mono', Menlo, Monaco, monospace";

// ── Static knowledge content — each article now carries a short summary ──
const TOPICS = [
  {
    icon: <GrassOutlinedIcon />,
    title: "Crop Yield",
    articles: [
      {
        title: "Spacing and planting density for higher yield",
        summary: "How row width and seed spacing change light capture and final yield per acre.",
        minutes: 4,
      },
      {
        title: "Reading your soil test before the season starts",
        summary: "What NPK numbers and pH actually tell you, and which ones to act on first.",
        minutes: 6,
      },
      {
        title: "Timing fertilizer application to the growth stage",
        summary: "Matching nutrient timing to germination, vegetative, and flowering phases.",
        minutes: 5,
      },
    ],
  },
  {
    icon: <SpaOutlinedIcon />,
    title: "Fertilizers",
    articles: [
      {
        title: "Choosing the right fertilizer for your crop",
        summary: "A simple framework for matching NPK ratios to what you're actually growing.",
        minutes: 5,
      },
      {
        title: "Organic vs. synthetic: what fits your field",
        summary: "Trade-offs in cost, release speed, and long-term soil health.",
        minutes: 6,
      },
      {
        title: "Avoiding nutrient burn from over-application",
        summary: "Early warning signs on leaves and how to correct course quickly.",
        minutes: 3,
      },
    ],
  },
  {
    icon: <BugReportOutlinedIcon />,
    title: "Pest Management",
    articles: [
      {
        title: "Early signs of common paddy pests",
        summary: "Visual cues on leaves and stems that flag an infestation before it spreads.",
        minutes: 4,
      },
      {
        title: "Integrated pest management without over-spraying",
        summary: "Combining biological, cultural, and chemical control to reduce chemical load.",
        minutes: 7,
      },
      {
        title: "Companion planting to naturally deter insects",
        summary: "Which plant pairings actually have evidence behind them, and which don't.",
        minutes: 5,
      },
    ],
  },
  {
    icon: <WaterDropOutlinedIcon />,
    title: "Soil Quality",
    articles: [
      {
        title: "Reading topsoil moisture by hand",
        summary: "A quick field test using texture and the ball-in-hand method.",
        minutes: 3,
      },
      {
        title: "Building a compost trench in 5 steps",
        summary: "A low-cost way to return organic matter directly into rotation beds.",
        minutes: 4,
      },
      {
        title: "Rotating crops to restore soil nutrients",
        summary: "Which crop families to alternate, and how long to rest a plot.",
        minutes: 6,
      },
    ],
  },
  {
    icon: <SensorsOutlinedIcon />,
    title: "IoT & Smart Farming",
    articles: [
      {
        title: "Setting up your first soil moisture sensor",
        summary: "Placement, calibration, and reading your first few days of data.",
        minutes: 6,
      },
      {
        title: "Automating drip irrigation on a schedule",
        summary: "Setting rules that adjust for rainfall instead of running on a fixed timer.",
        minutes: 5,
      },
      {
        title: "Using weather data to plan spraying windows",
        summary: "Avoiding wind drift and rain wash-off by checking forecasts before spraying.",
        minutes: 4,
      },
    ],
  },
];

const STATS = [
  { icon: <MenuBookOutlinedIcon />, value: "15+", label: "In-depth guides" },
  { icon: <CategoryOutlinedIcon />, value: "5", label: "Core topics" },
  { icon: <VerifiedOutlinedIcon />, value: "100%", label: "Field-reviewed" },
  { icon: <AccessTimeOutlinedIcon />, value: "~5 min", label: "Avg. read time" },
];

export default function KHub() {
  return (
    <Box sx={{ bgcolor: c.paper, minHeight: "100vh" }}>
      {/* HERO */}
      <Box
        sx={{
          position: "relative",
          py: { xs: 8, md: 10 },
          background: `linear-gradient(120deg, ${c.mossDeep} 0%, ${c.moss} 55%, ${c.mossMid} 100%)`,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "26px 26px",
            pointerEvents: "none",
          }}
        />
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              color: c.gold,
              fontFamily: fontMono,
              fontSize: "12.5px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              fontWeight: 600,
              border: "1px solid rgba(217,164,65,0.45)",
              borderRadius: "999px",
              px: 2,
              py: 0.7,
              mb: 3,
            }}
          >
            <MenuBookOutlinedIcon sx={{ fontSize: 15 }} />
            Farmer Knowledge Hub
          </Box>
          <Typography
            sx={{
              fontFamily: fontDisplay,
              fontWeight: 600,
              fontSize: { xs: "2.2rem", md: "3rem" },
              letterSpacing: "-1px",
              color: "#fff",
              mb: 2,
              maxWidth: 640,
            }}
          >
            Everything you need to grow with confidence
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.78)", fontSize: "17px", maxWidth: 560, lineHeight: 1.7 }}>
            Field-tested guides across yield, fertilizers, pests, soil, and smart farming —
            written to be read in a few minutes and used the same day.
          </Typography>
        </Container>
      </Box>

      {/* STATS STRIP */}
      <Container maxWidth="lg" sx={{ mt: -5, position: "relative", zIndex: 3 }}>
        <Box
          sx={{
            bgcolor: "#fff",
            borderRadius: "20px",
            border: `1px solid ${c.paperDeep}`,
            boxShadow: "0 16px 40px rgba(22,48,31,0.10)",
            p: { xs: 3, sm: 4 },
          }}
        >
          <Grid container spacing={3}>
            {STATS.map((stat, i) => (
              <Grid item xs={6} sm={3} key={stat.label}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    pl: { sm: i !== 0 ? 3 : 0 },
                    borderLeft: { sm: i !== 0 ? `1px solid ${c.paperDeep}` : "none" },
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "10px",
                      bgcolor: "rgba(184,132,43,0.10)",
                      color: c.goldDeep,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      "& svg": { fontSize: 20 },
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: "1.2rem", color: c.ink, lineHeight: 1.1 }}>
                      {stat.value}
                    </Typography>
                    <Typography sx={{ fontSize: "0.76rem", color: c.soil }}>{stat.label}</Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      {/* GUIDES */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 10 } }}>
        <Box sx={{ mb: 5, maxWidth: 560 }}>
          <Typography
            sx={{
              fontFamily: fontMono,
              fontSize: "11.5px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: c.goldDeep,
              mb: 1.5,
            }}
          >
            Knowledge base
          </Typography>
          <Typography sx={{ fontFamily: fontDisplay, fontWeight: 600, fontSize: { xs: "1.8rem", md: "2.2rem" }, color: c.ink }}>
            Guides by topic
          </Typography>
        </Box>

        {TOPICS.map((topic, idx) => (
          <Accordion
            key={topic.title}
            defaultExpanded={idx === 0}
            disableGutters
            elevation={0}
            sx={{
              bgcolor: "#fff",
              border: `1px solid ${c.paperDeep}`,
              borderRadius: "16px !important",
              mb: 2,
              overflow: "hidden",
              "&::before": { display: "none" },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: c.goldDeep }} />}
              sx={{ px: 3, py: 1 }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "10px",
                    bgcolor: "rgba(184,132,43,0.10)",
                    color: c.goldDeep,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    "& svg": { fontSize: 20 },
                  }}
                >
                  {topic.icon}
                </Box>
                <Typography sx={{ fontWeight: 700, color: c.ink, fontSize: "1.05rem" }}>
                  {topic.title}
                </Typography>
                <Chip
                  label={`${topic.articles.length} guides`}
                  size="small"
                  sx={{
                    fontFamily: fontMono,
                    fontSize: "0.7rem",
                    bgcolor: c.paperDeep,
                    color: c.soil,
                    ml: 1,
                  }}
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ px: 3, pb: 3, pt: 0 }}>
              {topic.articles.map((article) => (
                <Box
                  key={article.title}
                  sx={{
                    py: 1.8,
                    borderTop: `1px dashed ${c.paperDeep}`,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography sx={{ fontWeight: 600, color: c.ink, fontSize: "0.96rem", mb: 0.4 }}>
                      {article.title}
                    </Typography>
                    <Typography sx={{ color: c.soil, fontSize: "0.85rem", lineHeight: 1.55 }}>
                      {article.summary}
                    </Typography>
                  </Box>
                  <Chip
                    icon={<AccessTimeOutlinedIcon sx={{ fontSize: 14 }} />}
                    label={`${article.minutes} min`}
                    size="small"
                    sx={{
                      fontFamily: fontMono,
                      fontSize: "0.7rem",
                      bgcolor: "rgba(127,160,107,0.12)",
                      color: c.moss,
                      flexShrink: 0,
                    }}
                  />
                </Box>
              ))}
            </AccordionDetails>
          </Accordion>
        ))}
      </Container>
    </Box>
  );
}