import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";

import {
  Box,
  Typography,
  Button,
  Container,
  TextField,
  Paper,
} from "@mui/material";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import AirIcon from "@mui/icons-material/Air";

function Home() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================= WEATHER API =================
  useEffect(() => {
    const fetchWeather = async (lat, lon) => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather`,
          {
            params: {
              lat,
              lon,
              appid: import.meta.env.VITE_WEATHER_API,
              units: "metric",
            },
          }
        );

        setWeather(response.data);
      } catch (error) {
        console.log("Weather API Error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(
            position.coords.latitude,
            position.coords.longitude
          );
        },
        (error) => {
          console.log("Location Error:", error);
          setLoading(false);
        }
      );
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <Box>
      <Navbar />

      {/* ================= HERO SECTION ================= */}
      <Box
        sx={{
          position: "relative",
          minHeight: "100vh",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          py: { xs: 10, md: 0 },
        }}
      >
        {/* ================= VIDEO ================= */}
        <Box
          component="video"
          autoPlay
          muted
          loop
          playsInline
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: -3,
          }}
        >
          <source src="/farm-video.mp4" type="video/mp4" />
        </Box>

        {/* ================= OVERLAY ================= */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.45) 100%)",
            zIndex: -2,
          }}
        />

        {/* ================= CONTENT ================= */}
        <Container maxWidth="xl">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "1fr 380px",
              },
              alignItems: "center",
              gap: 6,
            }}
          >
            {/* ================= LEFT SIDE ================= */}
            <Box>
              

              {/* TITLE */}
              <Typography
                sx={{
                  textAlign: "left",
                  fontSize: {
                    xs: "54px",
                    sm: "72px",
                    md: "90px",
                  },
                  fontWeight: 900,
                  lineHeight: 0.95,
                  letterSpacing: "-4px",
                  color: "#fff",
                  mb: 3,
                }}
              >
               Smart Agriculture Solutions

                <br />
               for Better Harvests
              </Typography>

              {/* DESCRIPTION */}
              <Typography
                sx={{
                  textAlign: "left",
                  color: "rgba(255,255,255,0.75)",
                  fontSize: {
                    xs: "18px",
                    md: "22px",
                  },
                  lineHeight: 1.8,
                  maxWidth: "700px",
                  mb: 5,
                  
                }}
              >
                Looking to improve your farm’s productivity and results?
                <br/>
                Upgrade traditional farming with our advanced smart agriculture platform. We supply innovative sensor products, dedicated maintenance services, and a specialized knowledge hub.
               </Typography>

              {/* BUTTONS */}
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  flexWrap: "wrap",
                  mb: 5,
                }}
              >
                <Button
                  sx={{
                    background:
                      "linear-gradient(135deg,#66bb6a,#2e7d32)",
                    color: "#fff",
                    px: 4,
                    py: 1.8,
                    borderRadius: "16px",
                    fontWeight: 700,
                    textTransform: "none",

                    "&:hover": {
                      background:
                        "linear-gradient(135deg,#43a047,#1b5e20)",
                    },
                  }}
                >
                  Explore Products
                </Button>

                <Button
                  variant="outlined"
                  sx={{
                    borderColor: "rgba(255,255,255,0.30)",
                    color: "#fff",
                    px: 4,
                    py: 1.8,
                    borderRadius: "16px",
                    textTransform: "none",

                    "&:hover": {
                      borderColor: "#fff",
                      background: "rgba(255,255,255,0.08)",
                    },
                  }}
                >
                  Learn More
                </Button>
              </Box>

              {/* EMAIL BOX */}
              </Box>

            {/* ================= WEATHER CARD ================= */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  width: "100%",
                  maxWidth: 360,
                  p: 4,
                  borderRadius: "28px",
                  background: "rgba(255,255,255,0.12)",
                  backdropFilter: "blur(18px)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "#fff",
                }}
              >
                {loading ? (
                  <Typography>Loading weather...</Typography>
                ) : weather ? (
                  <>
                    {/* LOCATION */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 3,
                      }}
                    >
                      <LocationOnIcon />

                      <Typography
                        sx={{
                          fontWeight: 700,
                          fontSize: "18px",
                        }}
                      >
                        {weather.name}
                      </Typography>
                    </Box>

                    {/* TEMPERATURE */}
                    <Typography
                      sx={{
                        fontSize: "76px",
                        fontWeight: 900,
                        lineHeight: 1,
                      }}
                    >
                      {Math.round(weather.main.temp)}°
                    </Typography>

                    {/* WEATHER DESCRIPTION */}
                    <Typography
                      sx={{
                        textTransform: "capitalize",
                        color: "rgba(255,255,255,0.75)",
                        fontSize: "18px",
                        mb: 4,
                      }}
                    >
                      {weather.weather[0].description}
                    </Typography>

                    {/* WEATHER DETAILS */}
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 2,
                      }}
                    >
                      {/* HUMIDITY */}
                      <Box
                        sx={{
                          p: 2.5,
                          borderRadius: "20px",
                          background:
                            "rgba(255,255,255,0.08)",
                        }}
                      >
                        <WaterDropIcon />

                        <Typography
                          sx={{
                            mt: 1,
                            fontSize: "14px",
                            color:
                              "rgba(255,255,255,0.70)",
                          }}
                        >
                          Humidity
                        </Typography>

                        <Typography
                          sx={{
                            fontSize: "26px",
                            fontWeight: 800,
                          }}
                        >
                          {weather.main.humidity}%
                        </Typography>
                      </Box>

                      {/* WIND */}
                      <Box
                        sx={{
                          p: 2.5,
                          borderRadius: "20px",
                          background:
                            "rgba(255,255,255,0.08)",
                        }}
                      >
                        <AirIcon />

                        <Typography
                          sx={{
                            mt: 1,
                            fontSize: "14px",
                            color:
                              "rgba(255,255,255,0.70)",
                          }}
                        >
                          Wind
                        </Typography>

                        <Typography
                          sx={{
                            fontSize: "26px",
                            fontWeight: 800,
                          }}
                        >
                          {Math.round(
                            weather.wind.speed * 3.6
                          )}{" "}
                          km/h
                        </Typography>
                      </Box>
                    </Box>
                  </>
                ) : (
                  <Typography>
                    Unable to load weather data.
                  </Typography>
                )}
              </Paper>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default Home;