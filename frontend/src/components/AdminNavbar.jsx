import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Drawer,
  Toolbar,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Box,
} from "@mui/material";

// Modern Lucide-style React icons to elevate the design
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import AddBoxIcon from "@mui/icons-material/AddBox";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PeopleIcon from "@mui/icons-material/People";
import LogoutIcon from "@mui/icons-material/Logout";

const drawerWidth = 240;

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Integrated corresponding UI icons with navigation config array
  const menuItems = [
    { text: "Dashboard", path: "/admindashboard", icon: <DashboardIcon /> },
    { text: "Products", path: "/products", icon: <ShoppingBagIcon /> },
    { text: "Add Product", path: "/addproduct", icon: <AddBoxIcon /> },
    { text: "Orders", path: "/orders", icon: <ReceiptLongIcon /> },
    { text: "Customers", path: "/customers", icon: <PeopleIcon /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          background: "#1B5E20",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between", // Fixed typo: changed "between" to "space-between"
        },
      }}
    >
      {/* Top Section: Header & Main Navigation */}
      <Box>
        <Toolbar sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", pt: 2, pb: 1 }}>
          <Typography variant="h6" fontWeight="900" sx={{ letterSpacing: "0.5px", mb: -0.5 }}>
            TechAgro
          </Typography>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "1px" }}>
            Admin Console
          </Typography>
        </Toolbar>

        {/* Dynamic Nav Item List Loop */}
        <List sx={{ mt: 2, px: 1.5 }}>
          {menuItems.map((item) => {
            const isSelected = location.pathname === item.path;
            return (
              <ListItemButton
                key={item.text}
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: "10px",
                  mb: 0.8,
                  px: 2,
                  py: 1.2,
                  bgcolor: isSelected ? "rgba(255, 255, 255, 0.15)" : "transparent",
                  color: isSelected ? "#ffffff" : "rgba(255, 255, 255, 0.8)",
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                    color: "#ffffff"
                  },
                }}
              >
                <ListItemIcon sx={{ color: "inherit", minWidth: "40px" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ 
                    fontWeight: isSelected ? 700 : 500,
                    fontSize: "0.92rem"
                  }} 
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      {/* Bottom Section: Pin Logout Button directly to lower deck */}
      <Box sx={{ mt: "auto", pb: 3, px: 1.5 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: "10px",
            px: 2,
            py: 1.2,
            color: "#ffcdd2",
            "&:hover": {
              bgcolor: "rgba(211, 47, 47, 0.2)",
              color: "#ff8a80"
            },
          }}
        >
          <ListItemIcon sx={{ color: "inherit", minWidth: "40px" }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 600, fontSize: "0.92rem" }} />
        </ListItemButton>
      </Box>
    </Drawer>
  );
}