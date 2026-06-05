import React from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Grid,
  Paper,
  Card,
  useTheme,
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
import AdminSidebar from "../components/AdminNavbar"; 

const drawerWidth = 240;

// Mock Data Engine for analytical layout render
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

// Aesthetic clean hex palette matching TechAgro parameters
const COLORS = ["#1B5E20", "#43A047", "#81C784", "#C8E6C9"];

export default function AdminDashboard() {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8fafc" }}>
      {/* Reusable Sidebar component */}
      <AdminSidebar />

      {/* Main Framework Block */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: `calc(100% - ${drawerWidth}px)`,
          minHeight: "100vh",
        }}
      >
        {/* Top Fixed Header Bar */}
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            width: `calc(100% - ${drawerWidth}px)`,
            ml: `${drawerWidth}px`,
            bgcolor: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(12px)",
            color: "#0f172a",
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <Toolbar sx={{ minHeight: "80px" }}>
            <Box>
              <Typography variant="h3" fontWeight="800" sx={{ letterSpacing: "-0.5px" }}>
                Dashboard Overview
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Real-time marketplace telemetry updates for TechAgro.
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Structural Margin Offset push down below header */}
        <Toolbar sx={{ minHeight: "80px" }} />

        {/* Analytics Interactive Content Container Grid */}
        <Box sx={{ p: { xs: 3, md: 4 } }}>
          <Grid container spacing={3}>
            
            {/* Metric Card 1: Total Products */}
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={0}
                sx={{ p: 3, borderRadius: "16px", border: "1px solid #e2e8f0", bgcolor: "#fff" }}
              >
                <Typography variant="body2" color="#64748b" fontWeight="600">
                  Total Products
                </Typography>
                <Typography variant="h4" fontWeight="800" sx={{ mt: 1, color: "#0f172a" }}>
                  120
                </Typography>
              </Paper>
            </Grid>

            {/* Metric Card 2: Orders */}
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={0}
                sx={{ p: 3, borderRadius: "16px", border: "1px solid #e2e8f0", bgcolor: "#fff" }}
              >
                <Typography variant="body2" color="#64748b" fontWeight="600">
                  Active Orders
                </Typography>
                <Typography variant="h4" fontWeight="800" sx={{ mt: 1, color: "#0f172a" }}>
                  45
                </Typography>
              </Paper>
            </Grid>

            {/* Metric Card 3: Revenue */}
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={0}
                sx={{ p: 3, borderRadius: "16px", border: "1px solid #e2e8f0", bgcolor: "#fff" }}
              >
                <Typography variant="body2" color="#64748b" fontWeight="600">
                  Gross Revenue
                </Typography>
                <Typography variant="h4" fontWeight="800" sx={{ mt: 1, color: "#1B5E20" }}>
                  Rs. 250k
                </Typography>
              </Paper>
            </Grid>

            {/* Metric Card 4: Total Stock */}
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={0}
                sx={{ p: 3, borderRadius: "16px", border: "1px solid #e2e8f0", bgcolor: "#fff" }}
              >
                <Typography variant="body2" color="#64748b" fontWeight="600">
                  Stock Units
                </Typography>
                <Typography variant="h4" fontWeight="800" sx={{ mt: 1, color: "#0f172a" }}>
                  850
                </Typography>
              </Paper>
            </Grid>

            {/* Graphical Analytics Left Panel: Revenue Flow Curve Line */}
            <Grid item xs={12} lg={8}>
              <Card
                elevation={0}
                sx={{ p: 3, borderRadius: "20px", border: "1px solid #e2e8f0", bgcolor: "#fff" }}
              >
                <Typography variant="h6" fontWeight="700" sx={{ mb: 3 }}>
                  Revenue Trajectory History
                </Typography>
                <Box sx={{ width: "100%", height: 320 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1B5E20" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#1B5E20" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" tickLine={false} axisLine={false} stroke="#64748b" style={{ fontSize: "12px" }} />
                      <YAxis tickLine={false} axisLine={false} stroke="#64748b" style={{ fontSize: "12px" }} />
                      <Tooltip contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }} />
                      <Area type="monotone" dataKey="revenue" stroke="#1B5E20" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </Card>
            </Grid>

            {/* Graphical Analytics Right Panel: Inventory Breakdown Donut Chart */}
            <Grid item xs={12} lg={4}>
              <Card
                elevation={0}
                sx={{ p: 3, borderRadius: "20px", border: "1px solid #e2e8f0", bgcolor: "#fff", display: "flex", flexDirection: "column", height: "100%" }}
              >
                <Typography variant="h6" fontWeight="700" sx={{ mb: 2 }}>
                  Stock Distribution
                </Typography>
                <Box sx={{ width: "100%", height: 260, display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={65} // Makes it a sleek donut chart instead of full solid pie disc
                        outerRadius={85}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend iconType="circle" wrapperStyle={{ bottom: -5, fontSize: "13px" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Card>
            </Grid>

          </Grid>
        </Box>
      </Box>
    </Box>
  );
}