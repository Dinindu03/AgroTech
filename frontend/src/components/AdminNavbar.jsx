import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Box,
  Divider,
  Collapse,
  Chip,
  Typography,
  Avatar,
  IconButton,
  Tooltip,
} from "@mui/material";

import logo from "../assets/Logo.png";

// Icons
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
import AssignmentReturnOutlinedIcon from "@mui/icons-material/AssignmentReturnOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";

const drawerWidth = 270;

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: "Dashboard", path: "/admindashboard", icon: <DashboardIcon /> },
    { text: "Products Overview", path: "/products", icon: <ShoppingBagIcon /> },
    {
      text: "Update & Restock",
      path: "/UpdateProductInfo",
      icon: <EditNoteOutlinedIcon />,
    },
    { text: "Add New Product", path: "/addproduct", icon: <AddBoxIcon /> },
    { text: "Orders List", path: "/OdersList", icon: <ReceiptLongIcon /> },
    {
      text: "Customer Support",
      path: "/CustomerCare",
      icon: <PeopleIcon />,
      badge: "Support",
    },
  ];

  const shipmentItems = [
    {
      text: "Processing",
      path: "/ProcessOders",
      icon: <HourglassEmptyRoundedIcon />,
    },
    {
      text: "Packed Orders",
      path: "/ShippingOrders",
      icon: <Inventory2OutlinedIcon />,
    },
    {
      text: "Shipped & Delivered",
      path: "/DeliveredOrders",
      icon: <CheckCircleOutlineRoundedIcon />,
    },
    {
      text: "Returns & Received",
      path: "/ReturnedOrders",
      icon: <AssignmentReturnOutlinedIcon />,
    },
  ];

  const isShipmentPath = shipmentItems.some(
    (item) => location.pathname === item.path
  );

  const [shipmentOpen, setShipmentOpen] = useState(isShipmentPath);

  useEffect(() => {
    if (isShipmentPath) {
      setShipmentOpen(true);
    }
  }, [location.pathname, isShipmentPath]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navItemSx = (isSelected) => ({
    borderRadius: "12px",
    px: 2,
    py: 1.1,
    mb: 0.5,
    position: "relative",
    bgcolor: isSelected ? "rgba(34, 197, 94, 0.14)" : "transparent",
    color: isSelected ? "#4ade80" : "rgba(203, 213, 225, 0.82)",
    border: isSelected
      ? "1px solid rgba(74, 222, 128, 0.25)"
      : "1px solid transparent",
    transition: "all 0.22s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
      bgcolor: isSelected
        ? "rgba(34, 197, 94, 0.2)"
        : "rgba(255, 255, 255, 0.05)",
      color: isSelected ? "#4ade80" : "#ffffff",
      transform: "translateX(3px)",
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
          background:
            "linear-gradient(180deg, #09130e 0%, #0d1520 50%, #0a0e17 100%)",
          color: "#f8fafc",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          borderRight: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "4px 0 24px rgba(0,0,0,0.35)",
        },
      }}
    >
      <Box
        sx={{
          overflowY: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {/* Brand Header */}
        <Box sx={{ pt: 3.5, pb: 2, px: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              bgcolor: "rgba(255, 255, 255, 0.03)",
              p: 1.5,
              borderRadius: "16px",
              border: "1px solid rgba(255, 255, 255, 0.06)",
            }}
          >
            <Box
              component="img"
              src={logo}
              alt="AgroTech Logo"
              sx={{
                height: 42,
                width: "auto",
                objectFit: "contain",
                filter: "drop-shadow(0 2px 8px rgba(74, 222, 128, 0.25))",
              }}
            />
            <Box>
              <Typography
                variant="subtitle2"
                fontWeight={800}
                sx={{
                  color: "#ffffff",
                  letterSpacing: "0.5px",
                  lineHeight: 1.2,
                }}
              >
                AgroTech Admin
              </Typography>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 0.6, mt: 0.3 }}
              >
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    bgcolor: "#22c55e",
                    boxShadow: "0 0 8px #22c55e",
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{ color: "rgba(148, 163, 184, 0.8)", fontSize: "0.68rem" }}
                >
                  System Online
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Divider
          sx={{ borderColor: "rgba(255, 255, 255, 0.06)", mx: 2.5, mb: 2 }}
        />

        <Typography
          variant="caption"
          fontWeight={700}
          sx={{
            px: 3,
            mb: 1,
            display: "block",
            color: "rgba(148, 163, 184, 0.5)",
            letterSpacing: "1px",
            textTransform: "uppercase",
            fontSize: "0.68rem",
          }}
        >
          Main Navigation
        </Typography>

        <List sx={{ px: 2 }}>
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
                      left: -8,
                      top: "20%",
                      height: "60%",
                      width: "4px",
                      bgcolor: "#4ade80",
                      borderRadius: "0 4px 4px 0",
                      boxShadow: "0 0 10px #4ade80",
                    }}
                  />
                )}

                <ListItemIcon
                  sx={{
                    color: "inherit",
                    minWidth: "38px",
                    "& svg": { fontSize: "1.25rem" },
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isSelected ? 700 : 500,
                    fontSize: "0.85rem",
                  }}
                />
                {item.badge && (
                  <Chip
                    label={item.badge}
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: "0.62rem",
                      fontWeight: 700,
                      bgcolor: "rgba(59, 130, 246, 0.18)",
                      color: "#60a5fa",
                      border: "1px solid rgba(96, 165, 250, 0.3)",
                    }}
                  />
                )}
              </ListItemButton>
            );
          })}

          <Typography
            variant="caption"
            fontWeight={700}
            sx={{
              px: 1,
              mt: 2.5,
              mb: 1,
              display: "block",
              color: "rgba(148, 163, 184, 0.5)",
              letterSpacing: "1px",
              textTransform: "uppercase",
              fontSize: "0.68rem",
            }}
          >
            Fulfillment & Logistics
          </Typography>

          <ListItemButton
            onClick={() => setShipmentOpen((prev) => !prev)}
            sx={navItemSx(isShipmentPath)}
          >
            {isShipmentPath && (
              <Box
                sx={{
                  position: "absolute",
                  left: -8,
                  top: "20%",
                  height: "60%",
                  width: "4px",
                  bgcolor: "#4ade80",
                  borderRadius: "0 4px 4px 0",
                  boxShadow: "0 0 10px #4ade80",
                }}
              />
            )}

            <ListItemIcon
              sx={{
                color: "inherit",
                minWidth: "38px",
                "& svg": { fontSize: "1.25rem" },
              }}
            >
              <LocalShippingOutlinedIcon />
            </ListItemIcon>
            <ListItemText
              primary="Shipment Operations"
              primaryTypographyProps={{
                fontWeight: isShipmentPath ? 700 : 500,
                fontSize: "0.85rem",
              }}
            />
            <ExpandMoreRoundedIcon
              sx={{
                fontSize: "1.1rem",
                transition: "transform 0.25s ease",
                transform: shipmentOpen ? "rotate(180deg)" : "rotate(0deg)",
                color: "inherit",
                opacity: 0.7,
              }}
            />
          </ListItemButton>

          <Collapse in={shipmentOpen} timeout="auto" unmountOnExit>
            <List
              disablePadding
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 0.3,
                pl: 2.5,
                pt: 0.5,
                pb: 0.5,
                position: "relative",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  left: "26px",
                  top: "8px",
                  bottom: "8px",
                  width: "1px",
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              {shipmentItems.map((item) => {
                const isSelected = location.pathname === item.path;
                return (
                  <ListItemButton
                    key={item.text}
                    onClick={() => navigate(item.path)}
                    sx={{
                      ...navItemSx(isSelected),
                      py: 0.8,
                      borderRadius: "10px",
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: "inherit",
                        minWidth: "30px",
                        pl: 0.5,
                        "& svg": { fontSize: "1.05rem" },
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontWeight: isSelected ? 700 : 500,
                        fontSize: "0.8rem",
                      }}
                    />
                  </ListItemButton>
                );
              })}
            </List>
          </Collapse>
        </List>
      </Box>

      {/* Footer Profile & Logout Card */}
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            p: 1.5,
            borderRadius: "16px",
            bgcolor: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: "#22c55e",
                color: "#0f172a",
                fontWeight: 800,
                fontSize: "0.9rem",
              }}
            >
              A
            </Avatar>
            <Box>
              <Typography
                variant="subtitle2"
                fontWeight={700}
                sx={{
                  color: "#f8fafc",
                  fontSize: "0.82rem",
                  lineHeight: 1.2,
                }}
              >
                Admin User
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "rgba(148, 163, 184, 0.7)", fontSize: "0.7rem" }}
              >
                Manager
              </Typography>
            </Box>
          </Box>

          <Tooltip title="Logout" arrow placement="top">
            <IconButton
              onClick={handleLogout}
              sx={{
                color: "#f87171",
                bgcolor: "rgba(239, 68, 68, 0.1)",
                p: 1,
                borderRadius: "10px",
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "#ef4444",
                  color: "#ffffff",
                },
              }}
            >
              <LogoutIcon sx={{ fontSize: "1.1rem" }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Drawer>
  );
}