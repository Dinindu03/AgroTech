import React from "react";
import {
  Box,
  Toolbar,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
} from "@mui/material";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// Premium Outlined Modern UI Vector Icons
import ShoppingBagIcon from "@mui/icons-material/ShoppingBagOutlined";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLongOutlined";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOnOutlined";
import LayersIcon from "@mui/icons-material/LayersOutlined";

import AdminSidebar from "../components/AdminNavbar"; 

const SIDEBAR_WIDTH = 260; // Sync layout framework spacing

// Data Engines
const revenueData = [
  { month: "Jan", revenue: 45000 },
  { month: "Feb", revenue: 95000 },
  { month: "Mar", revenue: 120000 },
  { month: "Apr", revenue: 185000 },
  { month: "May", revenue: 210000 },
  { month: "Jun", revenue: 250000 },
];

const categoryDistribution = [
  { name: "Seeds", value: 350 },
  { name: "Fertilizers", value: 250 },
  { name: "IoT Devices", value: 150 },
  { name: "Plants", value: 100 },
];

// Luxury TechAgro Color Palette matching modern dark/emerald themes
const COLORS = ["#22c55e", "#10b981", "#34d399", "#a7f3d0"];

export default function AdminDashboard() {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8fafc" }}>
      {/* Permanent Anchor Navigation Sidebar */}
      <AdminSidebar />

      {/* Main Framework Viewport Workspace */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
          p: { xs: 3, md: 5 },
        }}
      >
        {/* Dynamic Fluid Brand Header (Replaced heavy AppBar for clean spacing) */}
        <Box mb={5}>
          <Typography variant="h4"  fontWeight="800" sx={{ fontFamily: "'Courier New', monospace", color: "#0f172a", letterSpacing: "-0.5px" }}>
            Dashboard Overview
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5 }}>
            Real-time marketplace telemetry updates for TechAgro reserves.
          </Typography>
        </Box>

        {/* Analytic Metrics Summary Cards Deck */}
        <Grid container spacing={3} mb={5}>
          {[
            { label: "Total Products", value: "120", icon: <ShoppingBagIcon />, color: "#3b82f6", bg: "rgba(59, 130, 246, 0.08)" },
            { label: "Active Orders", value: "45", icon: <ReceiptLongIcon />, color: "#8b5cf6", bg: "rgba(139, 92, 246, 0.08)" },
            { label: "Gross Revenue", value: "Rs. 250k", icon: <MonetizationOnIcon />, color: "#22c55e", bg: "rgba(34, 197, 94, 0.08)" },
            { label: "Stock Units", value: "850", icon: <LayersIcon />, color: "#f59e0b", bg: "rgba(245, 158, 11, 0.08)" },
          ].map((card, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Card sx={{ borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.01)" }}>
                <CardContent sx={{ p: 3, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Box>
                    <Typography variant="caption" fontWeight={600} sx={{ color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      {card.label}
                    </Typography>
                    <Typography variant="h4" fontWeight={800} sx={{ color: idx === 2 ? "#15803d" : "#1e293b", mt: 0.5, lineHeight: 1 }}>
                      {card.value}
                    </Typography>
                  </Box>
                  <Box sx={{ p: 1.5, borderRadius: "12px", color: card.color, bgcolor: card.bg, display: "flex" }}>
                    {card.icon}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Graphical Telemetry Matrix Wrapper Grid */}
        <Grid container spacing={4}>
          
          {/* Left Panel: Revenue Trajectory Curve Area Map */}
          <Grid item xs={12} lg={8}>
            <Paper
              elevation={0}
              sx={{ p: 3, borderRadius: "20px", border: "1px solid #e2e8f0", bgcolor: "#fff" }}
            >
              <br/> 
              <Typography variant="subtitle1" fontWeight="700" sx={{ mb: 3, color: "#1e293b" }}>
                Revenue Trajectory History
              </Typography>
              <br/><br/>
              <Box sx={{ width: "100%", height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0.005}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" tickLine={false} axisLine={false} stroke="#94a3b8" style={{ fontSize: "12px", fontWeight: 500 }} />
                    <YAxis tickLine={false} axisLine={false} stroke="#94a3b8" style={{ fontSize: "12px", fontWeight: 500 }} />
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)" }} />
                    <Area type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>

          {/* Right Panel: Inventory Distribution Donut Chart */}
          <Grid item xs={12} lg={4}>
            <Paper
              elevation={0}
              sx={{ p: 3, borderRadius: "20px", border: "1px solid #e2e8f0", bgcolor: "#fff", display: "flex", flexDirection: "column", height: "100%" }}
            >
              <Typography variant="subtitle1" fontWeight="700" sx={{ mb: 2, color: "#1e293b" }}>
                Stock Distribution
              </Typography>
              <Box sx={{ width: "100%", height: 260, display: "flex", justifyContent: "center", alignItems: "center", mt: "auto", mb: "auto" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryDistribution}
                      cx="50%"
                      cy="48%"
                      innerRadius={68}
                      outerRadius={88}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} style={{ outline: "none" }} />
                      ))}
                    </Pie>
                    <Tooltip containerStyle={{ borderRadius: "8px" }} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ bottom: 0, fontSize: "12px", fontWeight: 500, color: "#475569" }} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>

        </Grid>
      </Box>
    </Box>
  );
}