import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Container,
} from "@mui/material";

import {
  Facebook,
  Instagram,
  LinkedIn,
} from "@mui/icons-material";

const Footer = () => {
  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#06164A",
        overflowX: "hidden",
        mt: 4,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: {
            xs: "column",
            md: "row",
          },
          width: "100%",
        }}
      >
        {/* LEFT WHITE SECTION */}
        <Box
          sx={{
            position: "relative",
            backgroundColor: "#ffffff",

            width: {
              xs: "100%",
              md: "36%",
            },

            minHeight: {
              xs: 180,
              md: 240,
            },

            display: "flex",
            flexDirection: "column",
            justifyContent: "center",

            px: {
              xs: 3,
              md: 5,
            },

            py: {
              xs: 4,
              md: 5,
            },

            zIndex: 2,

            "&::after": {
              content: '""',
              position: "absolute",

              // MOBILE
              bottom: -25,
              left: 0,

              width: "100%",
              height: {
                xs: 25,
                md: "100%",
              },

              backgroundColor: "#ffffff",

              clipPath: {
                xs: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                md: "none",
              },

              // DESKTOP
              top: {
                md: 0,
              },

              bottom: {
                md: "auto",
              },

              right: {
                md: -40,
              },

              left: {
                md: "auto",
              },

              width: {
                md: 80,
              },

              transform: {
                md: "skewX(-20deg)",
              },

              zIndex: 1,
            },
          }}
        >
          {/* TITLE */}
          <Typography
            sx={{
              fontWeight: 800,
              color: "#111827",

              lineHeight: 1.2,

              mb: 2,

              fontSize: {
                xs: "28px",
                md: "38px",
              },
            }}
          >
            Association of Engineering
          </Typography>

          {/* DESCRIPTION */}
          <Typography
            sx={{
              color: "#6b7280",

              lineHeight: 1.8,

              fontSize: {
                xs: "14px",
                md: "15px",
              },

              maxWidth: "320px",
            }}
          >
            Empowering innovation, engineering excellence,
            research, and collaboration among future
            engineers through technology and creativity.
          </Typography>
        </Box>

        {/* RIGHT BLUE SECTION */}
        <Box
          sx={{
            width: {
              xs: "100%",
              md: "64%",
            },

            backgroundColor: "#06164A",

            px: {
              xs: 3,
              md: 6,
            },

            py: {
              xs: 5,
              md: 0,
            },

            display: "flex",
            alignItems: "center",
          }}
        >
          <Container maxWidth="lg" disableGutters>
            <Box
              sx={{
                width: "100%",

                display: "flex",

                flexDirection: {
                  xs: "column",
                  sm: "row",
                },

                justifyContent: "space-between",

                alignItems: "flex-start",

                gap: {
                  xs: 4,
                  md: 8,
                },

                pl: {
                  xs: 0,
                  md: 8,
                },
              }}
            >
              {/* EXPLORE */}
              <Box>
                <Typography
                  sx={{
                    color: "#ffffff",
                    fontWeight: 700,
                    mb: 2,

                    fontSize: {
                      xs: "13px",
                      md: "15px",
                    },

                    letterSpacing: "1px",
                  }}
                >
                  EXPLORE
                </Typography>

                {[
                  "About Us",
                  "News",
                  "Industry",
                  "Research",
                ].map((item) => (
                  <Typography
                    key={item}
                    sx={{
                      color: "#d1d5db",

                      mb: 1,

                      fontSize: {
                        xs: "13px",
                        md: "14px",
                      },

                      cursor: "pointer",

                      transition: "0.3s",

                      "&:hover": {
                        color: "#ffffff",
                        transform: "translateX(3px)",
                      },
                    }}
                  >
                    {item}
                  </Typography>
                ))}
              </Box>

              {/* DIRECTORIES */}
              <Box>
                <Typography
                  sx={{
                    color: "#ffffff",
                    fontWeight: 700,
                    mb: 2,

                    fontSize: {
                      xs: "13px",
                      md: "15px",
                    },

                    letterSpacing: "1px",
                  }}
                >
                  OTHER DIRECTORIES
                </Typography>

                {[
                  "Projects",
                  "Research & Publications",
                  "Virtual Faculty Tour",
                  "Events",
                ].map((item) => (
                  <Typography
                    key={item}
                    sx={{
                      color: "#d1d5db",

                      mb: 1,

                      fontSize: {
                        xs: "13px",
                        md: "14px",
                      },

                      cursor: "pointer",

                      transition: "0.3s",

                      "&:hover": {
                        color: "#ffffff",
                        transform: "translateX(3px)",
                      },
                    }}
                  >
                    {item}
                  </Typography>
                ))}
              </Box>

              {/* CONTACT + SOCIAL */}
              <Box>
                <Typography
                  sx={{
                    color: "#ffffff",
                    fontWeight: 700,
                    mb: 2,

                    fontSize: {
                      xs: "13px",
                      md: "15px",
                    },

                    letterSpacing: "1px",
                  }}
                >
                  KEEP IN TOUCH
                </Typography>

                <Typography
                  sx={{
                    color: "#d1d5db",
                    mb: 2,

                    fontSize: {
                      xs: "13px",
                      md: "14px",
                    },
                  }}
                >
                  engineering@university.edu
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    gap: 1.5,
                  }}
                >
                  {[Instagram, Facebook, LinkedIn].map(
                    (Icon, index) => (
                      <IconButton
                        key={index}
                        sx={{
                          color: "#ffffff",

                          border:
                            "1px solid rgba(255,255,255,0.2)",

                          width: {
                            xs: 40,
                            md: 46,
                          },

                          height: {
                            xs: 40,
                            md: 46,
                          },

                          transition: "0.3s",

                          "&:hover": {
                            backgroundColor:
                              "rgba(255,255,255,0.1)",

                            transform: "translateY(-2px)",
                          },
                        }}
                      >
                        <Icon
                          sx={{
                            fontSize: {
                              xs: 20,
                              md: 22,
                            },
                          }}
                        />
                      </IconButton>
                    )
                  )}
                </Box>
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>

      {/* BOTTOM COPYRIGHT */}
      <Box
        sx={{
          borderTop: "1px solid rgba(255,255,255,0.08)",
          py: 2,
          px: 3,
          textAlign: "center",
          backgroundColor: "#041038",
        }}
      >
        <Typography
          sx={{
            color: "#9ca3af",

            fontSize: {
              xs: "12px",
              md: "13px",
            },
          }}
        >
          © 2026 Association of Engineering. All rights
          reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;