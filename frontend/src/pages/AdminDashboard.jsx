import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  Skeleton,
  Chip,
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
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

import AdminSidebar from "../components/AdminNavbar";

const SIDEBAR_WIDTH = 260; // Sync layout framework spacing

// ── API config ───────────────────────────────────────────────
// Adjust these to match your actual backend routes.
const SUMMARY_URL = "http://localhost:5000/api/dashboard/summary";
const REVENUE_URL = "http://localhost:5000/api/dashboard/revenue";
const STOCK_URL = "http://localhost:5000/api/dashboard/stock-distribution";

// How often to poll for fresh data (ms). 15s keeps things "live" without hammering the API.
const POLL_INTERVAL_MS = 15000;

// Luxury AgroTech Color Palette matching modern dark/emerald themes
const COLORS = ["#22c55e", "#10b981", "#34d399", "#a7f3d0"];

// Formats a number like 250000 into "Rs. 250k" the way the static card used to.
function formatCurrency(value) {
  if (value == null) return "Rs. 0";
  if (value >= 1000) return `Rs. ${(value / 1000).toFixed(0)}k`;
  return `Rs. ${value}`;
}

export default function AdminDashboard() {
  const [summary, setSummary] = useState(null); // { totalProducts, activeOrders, grossRevenue, stockUnits }
  const [revenueData, setRevenueData] = useState([]);
  const [categoryDistribution, setCategoryDistribution] = useState([]);

  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingRevenue, setLoadingRevenue] = useState(true);
  const [loadingStock, setLoadingStock] = useState(true);

  const [lastUpdated, setLastUpdated] = useState(null);
  const [isLive, setIsLive] = useState(true);
  const pollRef = useRef(null);

  const fetchSummary = useCallback(async () => {
    try {
      const res = await axios.get(SUMMARY_URL);
      if (res.data.success) setSummary(res.data.data);
      setIsLive(true);
    } catch (err) {
      console.error("Fetch Summary Error:", err);
      setIsLive(false);
    } finally {
      setLoadingSummary(false);
    }
  }, []);

  const fetchRevenue = useCallback(async () => {
    try {
      const res = await axios.get(REVENUE_URL);
      if (res.data.success) setRevenueData(res.data.data);
      setIsLive(true);
    } catch (err) {
      console.error("Fetch Revenue Error:", err);
      setIsLive(false);
    } finally {
      setLoadingRevenue(false);
    }
  }, []);

  const fetchStockDistribution = useCallback(async () => {
    try {
      const res = await axios.get(STOCK_URL);
      if (res.data.success) setCategoryDistribution(res.data.data);
      setIsLive(true);
    } catch (err) {
      console.error("Fetch Stock Distribution Error:", err);
      setIsLive(false);
    } finally {
      setLoadingStock(false);
    }
  }, []);

  const fetchAll = useCallback(async () => {
    await Promise.all([fetchSummary(), fetchRevenue(), fetchStockDistribution()]);
    setLastUpdated(new Date());
  }, [fetchSummary, fetchRevenue, fetchStockDistribution]);

  useEffect(() => {
    fetchAll(); // initial load

    pollRef.current = setInterval(fetchAll, POLL_INTERVAL_MS);

    // Pause polling when the tab isn't visible, resume + refresh immediately when it becomes visible again.
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        fetchAll();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearInterval(pollRef.current);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [fetchAll]);

  const summaryCards = [
    {
      label: "Total Products",
      value: summary?.totalProducts ?? "—",
      icon: <ShoppingBagIcon />,
      color: "#3b82f6",
      bg: "rgba(59, 130, 246, 0.08)",
    },
    {
      label: "Active Orders",
      value: summary?.activeOrders ?? "—",
      icon: <ReceiptLongIcon />,
      color: "#8b5cf6",
      bg: "rgba(139, 92, 246, 0.08)",
    },
    {
      label: "Gross Revenue",
      value: summary ? formatCurrency(summary.grossRevenue) : "—",
      icon: <MonetizationOnIcon />,
      color: "#22c55e",
      bg: "rgba(34, 197, 94, 0.08)",
      highlight: true,
    },
    {
      label: "Stock Units",
      value: summary?.stockUnits ?? "—",
      icon: <LayersIcon />,
      color: "#f59e0b",
      bg: "rgba(245, 158, 11, 0.08)",
    },
  ];

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
        {/* Dynamic Fluid Brand Header */}
        <Box mb={5} sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight="800" sx={{ fontFamily: "'Courier New', monospace", color: "#0f172a", letterSpacing: "-0.5px" }}>
              Dashboard Overview
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5 }}>
              Real-time marketplace telemetry updates for TechAgro reserves.
            </Typography>
          </Box>

          {/* Live status indicator */}
          <Chip
            icon={
              <FiberManualRecordIcon
                sx={{
                  fontSize: "10px !important",
                  color: isLive ? "#22c55e" : "#ef4444",
                  animation: isLive ? "pulse 2s infinite" : "none",
                  "@keyframes pulse": {
                    "0%": { opacity: 1 },
                    "50%": { opacity: 0.35 },
                    "100%": { opacity: 1 },
                  },
                }}
              />
            }
            label={
              isLive
                ? `Live${lastUpdated ? ` · updated ${lastUpdated.toLocaleTimeString()}` : ""}`
                : "Connection lost — retrying…"
            }
            size="small"
            sx={{
              fontWeight: 600,
              bgcolor: isLive ? "#f0fdf4" : "#fef2f2",
              color: isLive ? "#166534" : "#b91c1c",
              border: `1px solid ${isLive ? "#bbf7d0" : "#fecaca"}`,
            }}
          />
        </Box>

        {/* Analytic Metrics Summary Cards Deck */}
        <Grid container spacing={3} mb={5}>
          {summaryCards.map((card, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Card sx={{ borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.01)" }}>
                <CardContent sx={{ p: 3, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Box sx={{ width: "100%" }}>
                    <Typography variant="caption" fontWeight={600} sx={{ color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      {card.label}
                    </Typography>
                    {loadingSummary ? (
                      <Skeleton variant="text" width={70} height={40} sx={{ mt: 0.5 }} />
                    ) : (
                      <Typography variant="h4" fontWeight={800} sx={{ color: card.highlight ? "#15803d" : "#1e293b", mt: 0.5, lineHeight: 1 }}>
                        {card.value}
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{ p: 1.5, borderRadius: "12px", color: card.color, bgcolor: card.bg, display: "flex", flexShrink: 0 }}>
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
              <Typography variant="subtitle1" fontWeight="700" sx={{ mb: 3, color: "#1e293b" }}>
                Revenue Trajectory History
              </Typography>
              <Box sx={{ width: "100%", height: 320 }}>
                {loadingRevenue ? (
                  <Skeleton variant="rounded" width="100%" height="100%" />
                ) : revenueData.length === 0 ? (
                  <Box sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                      No revenue data yet.
                    </Typography>
                  </Box>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#22c55e" stopOpacity={0.005} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" tickLine={false} axisLine={false} stroke="#94a3b8" style={{ fontSize: "12px", fontWeight: 500 }} />
                      <YAxis tickLine={false} axisLine={false} stroke="#94a3b8" style={{ fontSize: "12px", fontWeight: 500 }} />
                      <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)" }} />
                      <Area type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
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
                {loadingStock ? (
                  <Skeleton variant="circular" width={180} height={180} />
                ) : categoryDistribution.length === 0 ? (
                  <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                    No stock data yet.
                  </Typography>
                ) : (
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
                )}
              </Box>
            </Paper>
          </Grid>

        </Grid>
      </Box>
    </Box>
  );
}