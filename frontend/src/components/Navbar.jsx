import React, { useEffect, useState } from "react";
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
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";

import { Link, useNavigate } from "react-router-dom";

import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

const navItems = [
  { name: "Home", id: "home" },
  { name: "About Us", id: "about" },
  { name: "Product & Service", id: "productandservice" },
  { name: "Farming Problems", id: "problems" },
  { name: "Knowledge Hub", id: "knowledgehub" },
  { name: "Contact", id: "contact" },
];

export default function Navbar() {
  const navigate = useNavigate();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Home");
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState(null);

  // Sync user status on mount safely
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user session metadata profile.", e);
      }
    }
  }, []);

  const handleScroll = (id, name) => {
    setActiveItem(name);

    if (window.location.pathname !== "/") {
      navigate("/", { state: { scrollTo: id } });
      setDrawerOpen(false);
      return;
    }

    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    setDrawerOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setAnchorEl(null);
    setDrawerOpen(false);
    navigate("/");
  };

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  return (
    <>
    
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
          color: "#111",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            sx={{
              justifyContent: "space-between",
              minHeight: "80px",
            }}
          >
            {/* Logo */}
            <Box>
              <Typography
                sx={{
                  fontSize: 30,
                  fontWeight: 900,
                  color: "#1b5e20",
                }}
              >
                TechAgro
              </Typography>

              <Typography
                sx={{
                  fontSize: 11,
                  color: "#6b7280",
                  letterSpacing: 2,
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
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: "12px",
                    px: 2,

                    color:
                      activeItem === item.name
                        ? "#fff"
                        : "#374151",

                    backgroundColor:
                      activeItem === item.name
                        ? "#1b5e20"
                        : "transparent",

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

              <Button
                sx={{
                  ml: 1,
                  background:
                    "linear-gradient(135deg,#2e7d32,#43a047)",
                  color: "#fff",
                  textTransform: "none",
                  fontWeight: 700,
                  borderRadius: "12px",
                  px: 3,

                  "&:hover": {
                    background:
                      "linear-gradient(135deg,#1b5e20,#2e7d32)",
                  },
                }}
              >
                Shop Now
              </Button>

              {/* User Section */}
              {!user ? (
                <>
                  <Button
                    component={Link}
                    to="/login"
                    variant="contained"
                    sx={{
                      ml: 1,
                      background: "#4caf50",
                    }}
                  >
                    Login
                  </Button>

                  <Button
                    component={Link}
                    to="/signup"
                    variant="contained"
                    sx={{
                      background: "#616161",
                    }}
                  >
                    Sign Up
                  </Button>
                  <Button
                          component={Link}
                          to="/admindashboard"
                          variant="contained"
                          sx={{
                            background: "#1b5e20",
                          }}
                        >
                          Admin Dashboard
                        </Button>
                  
                </>
              ) : (
                <>
                  <IconButton onClick={openMenu}>
                    <Avatar
                      sx={{
                        bgcolor: "#2e7d32",
                        width: 42,
                        height: 42,
                      }}
                    >
                      {user.name?.charAt(0).toUpperCase()}
                    </Avatar>
                  </IconButton>

                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={closeMenu}
                  >
                    <Box sx={{ px: 2, py: 1 }}>
                      <Typography fontWeight="bold">
                        {user.name}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {user.email}
                      </Typography>
                    </Box>

                    <Divider />

                    <MenuItem onClick={handleLogout}>
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              )}
            </Box>

            {/* Mobile Menu */}
            <IconButton
              onClick={() => setDrawerOpen(true)}
              sx={{
                display: { xs: "flex", md: "none" },
              }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Drawer */}
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
              mb: 2,
            }}
          >
            <Typography
              fontWeight="bold"
              color="#1b5e20"
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
                variant="contained"
                component={Link}
                to="/login"
                sx={{ mt: 2 }}
              >
                Login
              </Button>

              <Button
                fullWidth
                variant="contained"
                component={Link}
                to="/signup"
                sx={{ mt: 1 }}
              >
                Sign Up
              </Button>
             
            </>
          ) : (
            <Box sx={{ textAlign: "center", mt: 3 }}>
              <Avatar
                sx={{
                  bgcolor: "#2e7d32",
                  width: 70,
                  height: 70,
                  mx: "auto",
                  mb: 1,
                }}
              >
                {user.name?.charAt(0).toUpperCase()}
              </Avatar>

              <Typography fontWeight="bold">
                {user.name}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                {user.email}
              </Typography>

              <Button
                fullWidth
                color="error"
                variant="contained"
                sx={{ mt: 2 }}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Box>
          )}
        </Box>
      </Drawer>
    </>
  );
}