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

import { Link, useNavigate } from "react-router-dom";

import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

const navItems = [
  { name: "Home", id: "home" },
  { name: "About Us", id: "about" },
  { name: "Products", id: "products" },
  { name: "Services", id: "services" },
  { name: "Farming Problems", id: "problems" },
  { name: "Knowledge Hub", id: "knowledge" },
  { name: "Contact", id: "contact" },
];

const Navbar = () => {
  const navigate = useNavigate();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Home");

  const user = JSON.parse(localStorage.getItem("user"));

  const handleScroll = (id, name) => {
    setActiveItem(name);

    const section = document.getElementById(id);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
      });
    }

    setDrawerOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload();
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(14px)",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
          color: "#111",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
              minHeight: "80px",
              px: 0,
            }}
          >
            {/* Logo */}
            <Box>
              <Typography
                sx={{
                  fontSize: "30px",
                  fontWeight: 900,
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
                }}
              >
                Smart Agriculture
              </Typography>
            </Box>

            {/* Desktop Menu */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 1,
              }}
            >
              {navItems.map((item) => (
                <Button
                  key={item.name}
                  onClick={() =>
                    handleScroll(item.id, item.name)
                  }
                  sx={{
                    color:
                      activeItem === item.name
                        ? "#fff"
                        : "#374151",

                    backgroundColor:
                      activeItem === item.name
                        ? "#1b5e20"
                        : "transparent",

                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: "12px",
                    px: 2,

                    "&:hover": {
                      backgroundColor:
                        activeItem === item.name
                          ? "#1b5e20"
                          : "#f3f4f6",
                    },
                  }}
                >
                  {item.name}
                </Button>
              ))}

              {/* Shop Button */}
              <Button
                sx={{
                  ml: 1,
                  background:
                    "linear-gradient(135deg,#2e7d32,#43a047)",
                  color: "#fff",
                  textTransform: "none",
                  fontWeight: 700,
                  px: 3,
                  borderRadius: "12px",

                  "&:hover": {
                    background:
                      "linear-gradient(135deg,#1b5e20,#2e7d32)",
                  },
                }}
              >
                Shop Now
              </Button>

              {/* Auth Section */}
              {!user ? (
                <>
                  <Button
                    component={Link}
                    to="/login"
                    sx={{
                      ml: 1,
                      background: "#4caf50",
                      color: "#fff",
                      textTransform: "none",
                      fontWeight: 700,
                      borderRadius: "12px",

                      "&:hover": {
                        background: "#388e3c",
                      },
                    }}
                  >
                    Login
                  </Button>

                  <Button
                    component={Link}
                    to="/signup"
                    sx={{
                      ml: 1,
                      background: "#616161",
                      color: "#fff",
                      textTransform: "none",
                      fontWeight: 700,
                      borderRadius: "12px",

                      "&:hover": {
                        background: "#424242",
                      },
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              ) : (
                <>
                  <Typography
                    sx={{
                      ml: 2,
                      fontWeight: "bold",
                      color: "#1b5e20",
                    }}
                  >
                    {user.name}
                  </Typography>

                  <Button
                    onClick={handleLogout}
                    sx={{
                      ml: 1,
                      background: "#d32f2f",
                      color: "#fff",
                      textTransform: "none",
                      fontWeight: 700,
                      borderRadius: "12px",

                      "&:hover": {
                        background: "#b71c1c",
                      },
                    }}
                  >
                    Logout
                  </Button>
                </>
              )}
            </Box>

            {/* Mobile Menu Icon */}
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

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 280, p: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 3,
            }}
          >
            <Typography
              sx={{
                fontWeight: "bold",
                color: "#1b5e20",
              }}
            >
              TechAgro
            </Typography>

            <IconButton
              onClick={() => setDrawerOpen(false)}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <List>
            {navItems.map((item) => (
              <ListItemButton
                key={item.name}
                onClick={() =>
                  handleScroll(item.id, item.name)
                }
              >
                <ListItemText primary={item.name} />
              </ListItemButton>
            ))}
          </List>

          {!user ? (
            <>
              <Button
                fullWidth
                component={Link}
                to="/login"
                sx={{ mt: 2 }}
              >
                Login
              </Button>

              <Button
                fullWidth
                component={Link}
                to="/signup"
                sx={{ mt: 1 }}
              >
                Sign Up
              </Button>
            </>
          ) : (
            <>
              <Typography
                sx={{
                  mt: 2,
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                {user.name}
              </Typography>

              <Button
                fullWidth
                color="error"
                onClick={handleLogout}
                sx={{ mt: 2 }}
              >
                Logout
              </Button>
            </>
          )}
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;