import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Drawer,
  Toolbar,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Box,
  Divider,
  Collapse,
  Chip,
} from "@mui/material";

import logo from "../assets/Logo.png";

// Modern Lucide-style React icons
import DashboardIcon from "@mui/icons-material/DashboardOutlined";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBagOutlined";
import AddBoxIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLongOutlined";
import PeopleIcon from "@mui/icons-material/PeopleOutlined";
import LogoutIcon from "@mui/icons-material/LogoutRounded";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import HourglassEmptyRoundedIcon from "@mui/icons-material/HourglassEmptyRounded";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";

const drawerWidth = 260;

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: "Dashboard", path: "/admindashboard", icon: <DashboardIcon /> },
    { text: "Products", path: "/products", icon: <ShoppingBagIcon /> },
    { text: "Add Product", path: "/addproduct", icon: <AddBoxIcon /> },
    { text: "Orders", path: "/OdersList", icon: <ReceiptLongIcon /> },
    { text: "Customers", path: "/customers", icon: <PeopleIcon /> },
  ];

  // Shipment Tracking sub-section — filters orders by fulfillment stage
  const shipmentItems = [
    {
      text: "Processing",
      path: "/ProcessOders",
      icon: <HourglassEmptyRoundedIcon />,
    },
    {
      text: "Shipped",
      path: "/ShippingOrders",
      icon: <Inventory2OutlinedIcon />,
    },
    {
      text: "Delivered",
      path: "/OrdersList?status=delivered",
      icon: <CheckCircleOutlineRoundedIcon />,
    },
  ];

  const isShipmentPath = shipmentItems.some(
    (item) => `${location.pathname}${location.search}` === item.path
  );

  const [shipmentOpen, setShipmentOpen] = useState(isShipmentPath);

  useEffect(() => {
    if (isShipmentPath) setShipmentOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.search]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navItemSx = (isSelected) => ({
    borderRadius: "12px",
    px: 2,
    py: 1.2,
    position: "relative",
    bgcolor: isSelected ? "rgba(34, 197, 94, 0.12)" : "transparent",
    color: isSelected ? "#4ade80" : "rgba(156, 163, 175, 0.9)",
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      bgcolor: isSelected ? "rgba(34, 197, 94, 0.16)" : "rgba(255, 255, 255, 0.03)",
      color: isSelected ? "#4ade80" : "#ffffff",
      transform: "translateX(2px)",
    },
  });

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          background: "linear-gradient(180deg, #0f2419 0%, #121824 100%)",
          color: "#f3f4f6",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          borderRight: "1px solid rgba(255, 255, 255, 0.06)",
        },
      }}
    >
      {/* Top Section: Header */}
      <Box
        sx={{
          overflowY: "auto",
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE/Edge
          "&::-webkit-scrollbar": { display: "none" }, // Chrome/Safari
        }}
      >
        <Toolbar sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", pt: 3, pb: 2, px: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              component="img"
              src={logo}
              alt="AgroTech Logo"
              sx={{
                height: { xs: 100, md: 130 },
                width: "auto",
                objectFit: "contain",
                mb: 3,
                filter: "drop-shadow(0 8px 20px rgba(255, 255, 255, 0))",
                position: "relative",
                zIndex: 1,
              }}
            />
          </Box>
        </Toolbar>

        <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.06)", mx: 2, mb: 2 }} />

        {/* Dynamic Nav Item List Loop */}
        <List sx={{ px: 2, gap: 0.5, display: "flex", flexDirection: "column" }}>
          {menuItems.map((item) => {
            const isSelected = location.pathname === item.path;
            return (
              <ListItemButton
                key={item.text}
                onClick={() => navigate(item.path)}
                sx={navItemSx(isSelected)}
              >
                {isSelected && (
                  <Box
                    sx={{
                      position: "absolute",
                      left: 0,
                      top: "25%",
                      height: "50%",
                      width: "4px",
                      bgcolor: "#4ade80",
                      borderRadius: "0 4px 4px 0",
                    }}
                  />
                )}

                <ListItemIcon
                  sx={{
                    color: "inherit",
                    minWidth: "36px",
                    "& svg": { fontSize: "1.3rem" },
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isSelected ? 600 : 500,
                    fontSize: "0.88rem",
                    letterSpacing: "0.1px",
                  }}
                />
              </ListItemButton>
            );
          })}

          {/* ── Shipment Tracking (collapsible group) ────────── */}
          <ListItemButton
            onClick={() => setShipmentOpen((prev) => !prev)}
            sx={navItemSx(isShipmentPath)}
          >
            {isShipmentPath && (
              <Box
                sx={{
                  position: "absolute",
                  left: 0,
                  top: "25%",
                  height: "50%",
                  width: "4px",
                  bgcolor: "#4ade80",
                  borderRadius: "0 4px 4px 0",
                }}
              />
            )}

            <ListItemIcon
              sx={{
                color: "inherit",
                minWidth: "36px",
                "& svg": { fontSize: "1.3rem" },
              }}
            >
              <LocalShippingOutlinedIcon />
            </ListItemIcon>
            <ListItemText
              primary="Shipment Tracking"
              primaryTypographyProps={{
                fontWeight: isShipmentPath ? 600 : 500,
                fontSize: "0.88rem",
                letterSpacing: "0.1px",
              }}
            />
            <ExpandMoreRoundedIcon
              sx={{
                fontSize: "1.15rem",
                transition: "transform 0.2s ease",
                transform: shipmentOpen ? "rotate(180deg)" : "rotate(0deg)",
                color: "inherit",
                opacity: 0.75,
              }}
            />
          </ListItemButton>

          <Collapse in={shipmentOpen} timeout="auto" unmountOnExit>
            <List sx={{ display: "flex", flexDirection: "column", gap: 0.4, pl: 1.2, pt: 0.4, pb: 0.4 }}>
              {shipmentItems.map((item) => {
                const isSelected = `${location.pathname}${location.search}` === item.path;
                return (
                  <ListItemButton
                    key={item.text}
                    onClick={() => navigate(item.path)}
                    sx={{
                      ...navItemSx(isSelected),
                      py: 0.9,
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        left: "18px",
                        top: 0,
                        bottom: 0,
                        width: "1px",
                        bgcolor: "rgba(255,255,255,0.08)",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: "inherit",
                        minWidth: "34px",
                        pl: 1.5,
                        "& svg": { fontSize: "1.1rem" },
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontWeight: isSelected ? 600 : 500,
                        fontSize: "0.82rem",
                      }}
                    />
                  </ListItemButton>
                );
              })}
            </List>
          </Collapse>
        </List>
      </Box>

      {/* Bottom Section: Logout Button */}
      <Box sx={{ p: 2 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: "12px",
            px: 2,
            py: 1.2,
            color: "#f87171",
            transition: "all 0.2s ease",
            "&:hover": {
              bgcolor: "rgba(239, 68, 68, 0.08)",
              color: "#f87171",
              "& .logout-icon": {
                transform: "translateX(-2px)",
              },
            },
          }}
        >
          <ListItemIcon
            className="logout-icon"
            sx={{
              color: "inherit",
              minWidth: "36px",
              transition: "transform 0.2s ease",
              "& svg": { fontSize: "1.3rem" },
            }}
          >
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 600, fontSize: "0.88rem" }} />
        </ListItemButton>
      </Box>
    </Drawer>
  );
}