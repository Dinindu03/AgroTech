import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  Container,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

const navItems = [
  "Home",
  "Products",
  "Services",
  "Farmers",
  "Contact",
];

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Home");

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(14px)",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          color: "#111",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
              minHeight: { xs: "74px", md: "82px" },
              px: "0 !important",
            }}
          >
            {/* LOGO / BRAND */}
            <Box>
              <Typography
                sx={{
                  fontSize: { xs: "24px", md: "30px" },
                  fontWeight: 900,
                  letterSpacing: "-1px",
                  color: "#1b5e20",
                  lineHeight: 1,
                }}
              >
                TechAgro
              </Typography>

              <Typography
                sx={{
                  fontSize: "12px",
                  color: "#6b7280",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  mt: 0.5,
                }}
              >
                Smart Agriculture
              </Typography>
            </Box>

            {/* DESKTOP MENU */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 1,
              }}
            >
              {navItems.map((item) => (
                <Button
                  key={item}
                  onClick={() => setActiveItem(item)}
                  sx={{
                    color:
                      activeItem === item ? "#ffffff" : "#374151",

                    backgroundColor:
                      activeItem === item
                        ? "#1b5e20"
                        : "transparent",

                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "15px",
                    px: 2.2,
                    py: 1,
                    borderRadius: "14px",
                    transition: "0.25s ease",

                    "&:hover": {
                      backgroundColor:
                        activeItem === item
                          ? "#1b5e20"
                          : "#f3f4f6",
                    },
                  }}
                >
                  {item}
                </Button>
              ))}

              {/* CTA BUTTON */}
              <Button
                sx={{
                  ml: 1,
                  background:
                    "linear-gradient(135deg, #2e7d32, #43a047)",
                  color: "#fff",
                  textTransform: "none",
                  fontWeight: 700,
                  px: 3,
                  py: 1,
                  borderRadius: "14px",
                  boxShadow: "0 8px 24px rgba(46,125,50,0.25)",

                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #1b5e20, #2e7d32)",
                  },
                }}
              >
                Shop Now
              </Button>
            </Box>

            {/* MOBILE MENU BUTTON */}
            <IconButton
              onClick={() => setDrawerOpen(true)}
              sx={{
                display: { xs: "flex", md: "none" },
                color: "#1b5e20",
              }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* ================= MOBILE DRAWER ================= */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            background: "#ffffff",
            borderTopLeftRadius: "24px",
            borderBottomLeftRadius: "24px",
            p: 2,
          },
        }}
      >
        {/* TOP */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography
            sx={{
              fontSize: "24px",
              fontWeight: 800,
              color: "#1b5e20",
            }}
          >
            TechAgro
          </Typography>

          <IconButton onClick={() => setDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* MOBILE NAV ITEMS */}
        <List>
          {navItems.map((item) => (
            <ListItemButton
              key={item}
              onClick={() => {
                setActiveItem(item);
                setDrawerOpen(false);
              }}
              sx={{
                borderRadius: "14px",
                mb: 1,
                backgroundColor:
                  activeItem === item
                    ? "#1b5e20"
                    : "transparent",

                "&:hover": {
                  backgroundColor:
                    activeItem === item
                      ? "#1b5e20"
                      : "#f3f4f6",
                },
              }}
            >
              <ListItemText
                primary={item}
                primaryTypographyProps={{
                  fontSize: "15px",
                  fontWeight: 600,
                  color:
                    activeItem === item
                      ? "#fff"
                      : "#374151",
                }}
              />
            </ListItemButton>
          ))}
        </List>

        {/* MOBILE CTA */}
        <Button
          fullWidth
          sx={{
            mt: 3,
            background:
              "linear-gradient(135deg, #2e7d32, #43a047)",
            color: "#fff",
            textTransform: "none",
            fontWeight: 700,
            py: 1.4,
            borderRadius: "14px",

            "&:hover": {
              background:
                "linear-gradient(135deg, #1b5e20, #2e7d32)",
            },
          }}
        >
          Shop Now
        </Button>
      </Drawer>
    </>
  );
};

export default Navbar;