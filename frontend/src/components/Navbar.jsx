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
  ListItem,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Badge,
} from "@mui/material";

import { Link, useNavigate } from "react-router-dom";

import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

// ── Design tokens — same light manifest palette as Checkout ────
const c = {
  bg: "#f6f7f2",
  surface: "#ffffff",
  surfaceSunken: "#f0f2ea",
  border: "rgba(20,40,10,0.10)",
  borderStrong: "rgba(70,161,29,0.55)",
  accent: "#3f9a17",
  accentBright: "#64dd17",
  accentDim: "rgba(70,161,29,0.08)",
  amber: "#e08e00",
  danger: "#d64545",
  text: "#12180f",
  textMuted: "rgba(18,24,15,0.58)",
  textFaint: "rgba(18,24,15,0.34)",
  shadow: "0 1px 2px rgba(20,40,10,0.04), 0 8px 24px rgba(20,40,10,0.05)",
};

const displayFont = "'Space Grotesk', 'Archivo', sans-serif";
const monoFont = "'IBM Plex Mono', 'Roboto Mono', monospace";

// Cart items now use an emoji tile instead of a product photo.
const CART_ITEM_EMOJI = "🌾";

function useManifestFonts() {
  useEffect(() => {
    const id = "manifest-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap";
    document.head.appendChild(link);
  }, []);
}

const navItems = [
  { name: "Home", id: "home" },
  { name: "About", id: "about" },
  { name: "Product & Service", id: "productandservice" },
  { name: "Farming Problems", id: "problems" },
  { name: "Knowledge Hub", id: "knowledgehub" },
  { name: "Contact", id: "contact" },
];

export default function Navbar({
  cart = [],
  setCart,
  cartTotalPrice = 0,
}) {
  useManifestFonts();
  const navigate = useNavigate();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Home");
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // ================= GET ITEM ID =================

  const getItemId = (item) => {
    return item.product_id || item.id || item._id;
  };

  // ================= LOAD USER =================

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("User data error:", error);
        localStorage.removeItem("user");
        setUser(null);
      }
    }
  }, []);

  // ================= CART COUNT =================

  const totalCartItems = cart.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0
  );

  // ================= NAVIGATION =================

  const handleScroll = (id, name) => {
    setActiveItem(name);

    if (window.location.pathname !== "/") {
      navigate("/", { state: { scrollTo: id } });
      setDrawerOpen(false);
      return;
    }

    const section = document.getElementById(id);

    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    setDrawerOpen(false);
  };

 
  const handleLogout = () => {
    if (user) {
      localStorage.removeItem(`cart_${user.email}`);
    }

    localStorage.removeItem("user");

    if (setCart) {
      setCart([]);
    }

    setUser(null);
    setAnchorEl(null);
    setDrawerOpen(false);
    setIsCartOpen(false);

    navigate("/", { replace: true });
  };

  // ================= OPEN CART =================

  const openCart = () => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    setIsCartOpen(true);
  };

  // ================= USER MENU =================

  const openMenu = (event) => setAnchorEl(event.currentTarget);
  const closeMenu = () => setAnchorEl(null);

  // ================= REMOVE CART ITEM =================

  const removeFromCart = (productId) => {
    setCart((prevCart) =>
      prevCart.filter((item) => getItemId(item) !== productId)
    );
  };

  // ================= INCREASE QUANTITY =================

  const increaseQty = (productId) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        getItemId(item) === productId
          ? { ...item, quantity: Number(item.quantity) + 1 }
          : item
      )
    );
  };

  // ================= DECREASE QUANTITY =================

  const decreaseQty = (productId) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          getItemId(item) === productId
            ? { ...item, quantity: Number(item.quantity) - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  return (
    <>
      {/* ================= NAVBAR ================= */}

      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: "rgba(246,247,242,0.88)",
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${c.border}`,
          color: c.text,
          backgroundImage: "none",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: "space-between", minHeight: "80px" }}>
            {/* ================= LOGO ================= */}

            <Box>
              <Typography
                sx={{
                  fontFamily: displayFont,
                  fontSize: 26,
                  fontWeight: 700,
                  color: c.text,
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                AgroTech
              </Typography>

              <Typography
                sx={{
                  fontFamily: monoFont,
                  fontSize: 10.5,
                  color: c.accent,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  mt: 0.3,
                }}
              >
                Smart Agriculture
              </Typography>
            </Box>

            {/* ================= DESKTOP MENU ================= */}

            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 0.5,
              }}
            >
              {navItems.map((item) => (
                <Button
                  key={item.name}
                  onClick={() => handleScroll(item.id, item.name)}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "0.88rem",
                    borderRadius: "10px",
                    px: 1.8,
                    color: activeItem === item.name ? "#ffffff" : c.textMuted,
                    backgroundColor:
                      activeItem === item.name ? c.accent : "transparent",
                    "&:hover": {
                      backgroundColor:
                        activeItem === item.name ? c.accent : c.accentDim,
                      color: activeItem === item.name ? "#ffffff" : c.accent,
                    },
                  }}
                >
                  {item.name}
                </Button>
              ))}

              {/* CART */}

              <IconButton
                onClick={openCart}
                sx={{
                  ml: 1,
                  color: c.accent,
                  border: `1px solid ${c.border}`,
                  "&:hover": { borderColor: c.borderStrong, bgcolor: c.accentDim },
                }}
              >
                <Badge
                  badgeContent={totalCartItems}
                  sx={{
                    "& .MuiBadge-badge": {
                      bgcolor: c.accent,
                      color: "#ffffff",
                      fontFamily: monoFont,
                      fontSize: "0.65rem",
                    },
                  }}
                >
                  <ShoppingCartIcon sx={{ fontSize: 22 }} />
                </Badge>
              </IconButton>

              {!user ? (
                <>
                  <Button
                    component={Link}
                    to="/login"
                    variant="outlined"
                    sx={{
                      ml: 1.5,
                      mr: 1,
                      borderRadius: "10px",
                      textTransform: "none",
                      fontWeight: 700,
                      fontFamily: monoFont,
                      fontSize: "0.85rem",
                      color: c.accent,
                      borderColor: c.borderStrong,
                      "&:hover": {
                        borderColor: c.accent,
                        bgcolor: c.accentDim,
                      },
                    }}
                  >
                    Login
                  </Button>

                  <Button
                    component={Link}
                    to="/signup"
                    variant="contained"
                    sx={{
                      borderRadius: "10px",
                      textTransform: "none",
                      fontWeight: 700,
                      fontFamily: monoFont,
                      fontSize: "0.85rem",
                      color: "#ffffff",
                      bgcolor: c.accent,
                      boxShadow: "none",
                      "&:hover": {
                        bgcolor: "#357f13",
                        boxShadow: "none",
                      },
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              ) : (
                <>
                  <IconButton
                    onClick={openMenu}
                    sx={{
                      ml: 1,
                      p: 0.4,
                      border: `1px solid ${c.border}`,
                      "&:hover": { borderColor: c.borderStrong },
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: c.accentDim,
                        color: c.accent,
                        width: 40,
                        height: 40,
                        fontFamily: displayFont,
                        fontWeight: 700,
                        border: `1px solid ${c.borderStrong}`,
                      }}
                    >
                      {user.name?.charAt(0).toUpperCase()}
                    </Avatar>
                  </IconButton>

                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={closeMenu}
                    PaperProps={{
                      sx: {
                        mt: 1,
                        minWidth: 220,
                        borderRadius: "14px",
                        border: `1px solid ${c.border}`,
                        boxShadow: c.shadow,
                        bgcolor: c.surface,
                        backgroundImage: "none",
                      },
                    }}
                  >
                    <Box sx={{ px: 2.2, py: 1.6 }}>
                      <Typography
                        sx={{
                          fontFamily: monoFont,
                          fontSize: "0.68rem",
                          letterSpacing: "0.1em",
                          color: c.accent,
                          textTransform: "uppercase",
                          mb: 0.5,
                        }}
                      >
                        Account holder
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: displayFont,
                          fontWeight: 700,
                          fontSize: "0.98rem",
                          color: c.text,
                        }}
                      >
                        {user.name}
                      </Typography>
                      <Typography sx={{ fontSize: "0.78rem", color: c.textMuted, mt: 0.2 }}>
                        {user.email}
                      </Typography>
                    </Box>

                    <Divider sx={{ borderStyle: "dashed", borderColor: c.border, mx: 2 }} />

                    {/* SHIPPING DETAILS */}

                    <MenuItem
                      onClick={() => {
                        closeMenu();
                        navigate("/shipping-details");
                      }}
                      sx={{
                        mx: 1,
                        my: 0.5,
                        borderRadius: "8px",
                        fontSize: "0.88rem",
                        fontWeight: 500,
                        color: c.text,
                        "&:hover": { bgcolor: c.accentDim, color: c.accent },
                      }}
                    >
                      Shipping Details
                    </MenuItem>

                    {/* LOGOUT */}

                    <MenuItem
                      onClick={handleLogout}
                      sx={{
                        mx: 1,
                        mb: 0.5,
                        borderRadius: "8px",
                        fontSize: "0.88rem",
                        fontWeight: 500,
                        color: c.amber,
                        "&:hover": { bgcolor: "rgba(224,142,0,0.08)" },
                      }}
                    >
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              )}
            </Box>

            {/* MOBILE MENU */}

            <IconButton
              onClick={() => setDrawerOpen(true)}
              sx={{
                display: { xs: "flex", md: "none" },
                color: c.text,
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
        PaperProps={{ sx: { bgcolor: c.bg, backgroundImage: "none" } }}
      >
        <Box sx={{ width: 280, p: 2.5 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography
              sx={{ fontFamily: displayFont, fontWeight: 700, fontSize: "1.1rem", color: c.text }}
            >
              AgroTech
            </Typography>

            <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: c.textMuted }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <List sx={{ p: 0 }}>
            {navItems.map((item) => (
              <ListItemButton
                key={item.name}
                onClick={() => handleScroll(item.id, item.name)}
                sx={{
                  borderRadius: "10px",
                  mb: 0.5,
                  backgroundColor:
                    activeItem === item.name ? c.accentDim : "transparent",
                }}
              >
                <ListItemText
                  primary={item.name}
                  primaryTypographyProps={{
                    fontWeight: activeItem === item.name ? 700 : 500,
                    fontSize: "0.92rem",
                    color: activeItem === item.name ? c.accent : c.text,
                  }}
                />
              </ListItemButton>
            ))}
          </List>

          {/* MOBILE CART */}

          <Button
            fullWidth
            variant="outlined"
            onClick={() => {
              openCart();
              setDrawerOpen(false);
            }}
            startIcon={
              <Badge
                badgeContent={totalCartItems}
                sx={{ "& .MuiBadge-badge": { bgcolor: c.accent, color: "#fff" } }}
              >
                <ShoppingCartIcon />
              </Badge>
            }
            sx={{
              mt: 2.5,
              py: 1.2,
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 700,
              color: c.accent,
              borderColor: c.borderStrong,
              "&:hover": { borderColor: c.accent, bgcolor: c.accentDim },
            }}
          >
            View Cart
          </Button>

          {/* MOBILE USER */}

          {!user ? (
            <>
              <Button
                fullWidth
                variant="contained"
                component={Link}
                to="/login"
                onClick={() => setDrawerOpen(false)}
                sx={{
                  mt: 1.5,
                  py: 1.2,
                  borderRadius: "10px",
                  textTransform: "none",
                  fontWeight: 700,
                  bgcolor: c.accent,
                  boxShadow: "none",
                  "&:hover": { bgcolor: "#357f13", boxShadow: "none" },
                }}
              >
                Login
              </Button>

              <Button
                fullWidth
                variant="outlined"
                component={Link}
                to="/signup"
                onClick={() => setDrawerOpen(false)}
                sx={{
                  mt: 1,
                  py: 1.2,
                  borderRadius: "10px",
                  textTransform: "none",
                  fontWeight: 700,
                  color: c.text,
                  borderColor: c.border,
                  "&:hover": { borderColor: c.borderStrong, bgcolor: c.surfaceSunken },
                }}
              >
                Sign Up
              </Button>
            </>
          ) : (
            <Box sx={{ textAlign: "center", mt: 3 }}>
              <Avatar
                sx={{
                  bgcolor: c.accentDim,
                  color: c.accent,
                  width: 64,
                  height: 64,
                  mx: "auto",
                  mb: 1.2,
                  fontFamily: displayFont,
                  fontWeight: 700,
                  border: `1px solid ${c.borderStrong}`,
                }}
              >
                {user.name?.charAt(0).toUpperCase()}
              </Avatar>

              <Typography sx={{ fontFamily: displayFont, fontWeight: 700, color: c.text }}>
                {user.name}
              </Typography>

              <Typography sx={{ fontSize: "0.8rem", color: c.textMuted }}>
                {user.email}
              </Typography>

              <Button
                fullWidth
                variant="outlined"
                sx={{
                  mt: 2.5,
                  py: 1.1,
                  borderRadius: "10px",
                  textTransform: "none",
                  fontWeight: 700,
                  color: c.amber,
                  borderColor: "rgba(224,142,0,0.4)",
                  "&:hover": { bgcolor: "rgba(224,142,0,0.08)", borderColor: c.amber },
                }}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Box>
          )}
        </Box>
      </Drawer>

      {/* ================= CART DRAWER ================= */}

      <Drawer
        anchor="right"
        open={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: "100vw", sm: "400px" },
            bgcolor: c.bg,
            color: c.text,
            display: "flex",
            flexDirection: "column",
            backgroundImage: "none",
          },
        }}
      >
        {/* CART HEADER */}

        <Box
          sx={{
            p: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: `1px solid ${c.border}`,
            bgcolor: c.surface,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <ShoppingCartIcon sx={{ color: c.accent }} />

            <Box>
              <Typography
                sx={{ fontFamily: monoFont, fontSize: "0.65rem", color: c.textFaint, letterSpacing: "0.1em" }}
              >
                CARGO HOLD
              </Typography>
              <Typography sx={{ fontFamily: displayFont, fontWeight: 700, fontSize: "1.05rem" }}>
                Your Cart
              </Typography>
            </Box>
          </Box>

          <IconButton onClick={() => setIsCartOpen(false)} sx={{ color: c.textMuted }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* CART ITEMS */}

        <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2 }}>
          {cart.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 10, color: c.textFaint }}>
              <ShoppingCartIcon sx={{ fontSize: 52, mb: 2, opacity: 0.3 }} />
              <Typography sx={{ fontWeight: 600, color: c.textMuted }}>
                Nothing loaded yet
              </Typography>
              <Typography sx={{ fontSize: "0.8rem", mt: 0.5 }}>
                Items you add will show up here
              </Typography>
            </Box>
          ) : (
            <List disablePadding>
              {cart.map((item, i) => {
                const itemId = getItemId(item);

                return (
                  <React.Fragment key={itemId}>
                    <ListItem
                      disableGutters
                      secondaryAction={
                        <IconButton
                          edge="end"
                          onClick={() => removeFromCart(itemId)}
                          sx={{ color: c.danger, opacity: 0.7, "&:hover": { opacity: 1 } }}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      }
                      sx={{ py: 2, px: 1 }}
                    >
                      <Box sx={{ display: "flex", gap: 2, alignItems: "center", width: "80%" }}>
                        {/* Emoji tile replaces the product photo */}
                        <Box
                          sx={{
                            width: 54,
                            height: 54,
                            borderRadius: "10px",
                            border: `1px solid ${c.border}`,
                            bgcolor: c.accentDim,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "1.6rem",
                            flexShrink: 0,
                          }}
                          aria-hidden="true"
                        >
                          {CART_ITEM_EMOJI}
                        </Box>

                        <Box sx={{ overflow: "hidden", flexGrow: 1 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 700,
                              color: c.text,
                              mb: 0.6,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {item.name}
                          </Typography>

                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                bgcolor: c.surfaceSunken,
                                borderRadius: "8px",
                                border: `1px solid ${c.border}`,
                              }}
                            >
                              <IconButton
                                size="small"
                                onClick={() => decreaseQty(itemId)}
                                sx={{ color: c.text, p: 0.3 }}
                              >
                                <RemoveIcon sx={{ fontSize: 13 }} />
                              </IconButton>

                              <Typography
                                variant="caption"
                                sx={{ fontFamily: monoFont, color: c.text, px: 1.4, fontWeight: 700 }}
                              >
                                {item.quantity}
                              </Typography>

                              <IconButton
                                size="small"
                                onClick={() => increaseQty(itemId)}
                                sx={{ color: c.text, p: 0.3 }}
                              >
                                <AddIcon sx={{ fontSize: 13 }} />
                              </IconButton>
                            </Box>

                            <Typography
                              variant="caption"
                              sx={{ fontFamily: monoFont, color: c.textFaint }}
                            >
                              @ Rs. {Number(item.price).toLocaleString()}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </ListItem>

                    {i < cart.length - 1 && (
                      <Divider sx={{ borderStyle: "dotted", borderColor: c.border }} />
                    )}
                  </React.Fragment>
                );
              })}
            </List>
          )}
        </Box>

        {/* CART TOTAL */}

        {cart.length > 0 && (
          <Box sx={{ p: 3, borderTop: `1px dashed ${c.border}`, bgcolor: c.surface }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2.5, alignItems: "baseline" }}>
              <Typography sx={{ color: c.textMuted, fontSize: "0.85rem", fontWeight: 600 }}>
                Total order value
              </Typography>

              <Typography
                sx={{ fontFamily: displayFont, color: c.accent, fontWeight: 700, fontSize: "1.35rem" }}
              >
                Rs. {Number(cartTotalPrice).toLocaleString()}
              </Typography>
            </Box>

            <Button
              fullWidth
              variant="contained"
              onClick={() => {
                setIsCartOpen(false);
                navigate("/checkout");
              }}
              sx={{
                py: 1.5,
                borderRadius: "10px",
                fontWeight: 700,
                textTransform: "none",
                fontFamily: displayFont,
                color: "#ffffff",
                bgcolor: c.accent,
                boxShadow: "none",
                "&:hover": { bgcolor: "#357f13", boxShadow: "none" },
              }}
            >
              Proceed to Checkout →
            </Button>
          </Box>
        )}
      </Drawer>
    </>
  );
}