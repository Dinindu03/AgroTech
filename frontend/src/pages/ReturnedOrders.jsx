import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  Chip,
  Paper,
  Divider,
  List,
  ListItem,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/SearchOutlined";
import AssignmentReturnOutlinedIcon from "@mui/icons-material/AssignmentReturnOutlined";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import HourglassEmptyRoundedIcon from "@mui/icons-material/HourglassEmptyRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";

import AdminSidebar from "../components/AdminNavbar";

const SIDEBAR_WIDTH = 260;
const RETURNS_URL = "http://localhost:5000/api/orders/returns";

export default function ReturnsManagement() {
  const [tab, setTab] = useState(0); // 0 = Awaiting Return, 1 = Received/Completed
  const [search, setSearch] = useState("");
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [confirmTarget, setConfirmTarget] = useState(null);

  useEffect(() => {
    fetchReturns();
  }, []);

  const fetchReturns = async () => {
    try {
      setLoading(true);
      const res = await axios.get(RETURNS_URL);
      if (res.data?.success) {
        setReturns(res.data.returns || []);
      }
    } catch (err) {
      console.error("Fetch Returns Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ── Receive Order and Save Date ─────────────────────────────
  const handleReceiveOrder = async () => {
    if (!confirmTarget) return;
    const target = confirmTarget;
    setConfirmTarget(null);

    const currentDate = new Date().toISOString(); // Current timestamp

    try {
      setUpdatingId(target.order_id);

      const res = await axios.put(
        `http://localhost:5000/api/orders/confirm-return/${target.order_id}`,
        {
          received_date: currentDate, // Sending current date to database
        }
      );

      if (res.data?.success) {
        setReturns((prev) =>
          prev.map((r) =>
            r.order_id === target.order_id
              ? {
                  ...r,
                  return_status: "Received",
                  shipping_status: "Return Completed",
                  received_date: currentDate,
                }
              : r
          )
        );
      }
    } catch (err) {
      console.error("Receive Order Error:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const pendingReturns = returns.filter((r) => r.return_status !== "Received");
  const completedReturns = returns.filter((r) => r.return_status === "Received");

  const activeList = tab === 0 ? pendingReturns : completedReturns;

  const filteredReturns = activeList.filter((ret) => {
    const s = search.toLowerCase();
    return (
      String(ret.order_id).toLowerCase().includes(s) ||
      ret.consignee_name?.toLowerCase().includes(s) ||
      ret.reason?.toLowerCase().includes(s)
    );
  });

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8fafc" }}>
      <AdminSidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
          p: { xs: 3, md: 5 },
        }}
      >
        {/* HEADER */}
        <Box mb={4}>
          <Typography
            variant="h4"
            fontWeight={800}
            sx={{ color: "#0f172a", letterSpacing: "-0.5px" }}
          >
            Receive Return Orders
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5 }}>
            Mark returned packages as received, log arrival dates, and restock warehouse stock.
          </Typography>
        </Box>

        {/* SUMMARY METRICS */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: "16px", border: "1px solid #e2e8f0" }}>
              <CardContent
                sx={{
                  p: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    sx={{
                      color: "#64748b",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Awaiting Arrival
                  </Typography>
                  <Typography
                    variant="h5"
                    fontWeight={800}
                    sx={{ color: "#c2410c", mt: 0.5 }}
                  >
                    {pendingReturns.length}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: "12px",
                    color: "#c2410c",
                    bgcolor: "rgba(194,65,12,0.08)",
                    display: "flex",
                  }}
                >
                  <HourglassEmptyRoundedIcon />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: "16px", border: "1px solid #e2e8f0" }}>
              <CardContent
                sx={{
                  p: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    sx={{
                      color: "#64748b",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Received Orders
                  </Typography>
                  <Typography
                    variant="h5"
                    fontWeight={800}
                    sx={{ color: "#15803d", mt: 0.5 }}
                  >
                    {completedReturns.length}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: "12px",
                    color: "#15803d",
                    bgcolor: "rgba(21,128,61,0.08)",
                    display: "flex",
                  }}
                >
                  <CheckCircleOutlineRoundedIcon />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* NAVIGATION TABS */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
            bgcolor: "#fff",
            mb: 3,
            px: 1,
          }}
        >
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 700,
                fontSize: "0.88rem",
                minHeight: 52,
              },
              "& .Mui-selected": { color: "#ea580c !important" },
              "& .MuiTabs-indicator": { bgcolor: "#ea580c" },
            }}
          >
            <Tab label={`Pending Returns (${pendingReturns.length})`} />
            <Tab label={`Received History (${completedReturns.length})`} />
          </Tabs>
        </Paper>

        {/* SEARCH BAR */}
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: "16px",
            mb: 4,
            border: "1px solid #e2e8f0",
            bgcolor: "#fff",
          }}
        >
          <TextField
            fullWidth
            placeholder="Search by Order ID, Consignee, or Reason..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#94a3b8" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                bgcolor: "#f8fafc",
                "& fieldset": { borderColor: "#e2e8f0" },
              },
            }}
          />
        </Paper>

        {/* LOADING INDICATOR */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
            <CircularProgress sx={{ color: "#ea580c" }} />
          </Box>
        )}

        {/* RETURNS CARDS LIST */}
        {!loading && (
          <>
            {filteredReturns.length === 0 ? (
              <EmptyState
                text={
                  tab === 0
                    ? "No pending return requests to receive."
                    : "No received orders in history."
                }
              />
            ) : (
              filteredReturns.map((ret) => (
                <ReturnCard
                  key={ret.return_id || ret.order_id}
                  ret={ret}
                  isUpdating={updatingId === ret.order_id}
                  onReceiveClick={() => setConfirmTarget(ret)}
                />
              ))
            )}
          </>
        )}
      </Box>

      {/* CONFIRM RECEIVE DIALOG */}
      <Dialog
        open={Boolean(confirmTarget)}
        onClose={() => setConfirmTarget(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: "16px", border: "1px solid #e2e8f0" } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: "#0f172a" }}>
          Mark Order #{confirmTarget?.order_id} as Received?
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: "#64748b" }}>
            This will confirm that the returned package arrived today (<strong>{new Date().toLocaleDateString()}</strong>). 
            The system will update the received date and add items back to your inventory stock.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            onClick={() => setConfirmTarget(null)}
            sx={{ textTransform: "none", fontWeight: 700, color: "#64748b" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleReceiveOrder}
            startIcon={<EventAvailableRoundedIcon sx={{ fontSize: 18 }} />}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              borderRadius: "10px",
              px: 2.5,
              color: "#fff",
              bgcolor: "#16a34a",
              "&:hover": { bgcolor: "#15803d" },
            }}
          >
            Receive Order &amp; Save Date
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// ── Return Card Component ──────────────────────────────────────

function ReturnCard({ ret, isUpdating, onReceiveClick }) {
  const isReceived = ret.return_status === "Received";
  const itemCount =
    ret.items?.reduce((sum, item) => sum + Number(item.quantity || 0), 0) || 0;

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: "16px",
        border: "1px solid #e2e8f0",
        bgcolor: "#fff",
        mb: 2.5,
        overflow: "hidden",
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          p: 3,
          bgcolor: "#f8fafc",
          borderBottom: "1px solid #e2e8f0",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1.5,
        }}
      >
        <Box>
          <Typography variant="caption" fontWeight={700} sx={{ color: "#94a3b8" }}>
            ORDER #{ret.order_id} · Requested{" "}
            {ret.return_requested_at
              ? new Date(ret.return_requested_at).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "—"}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.7, mt: 0.3 }}>
            <PersonOutlineRoundedIcon sx={{ fontSize: 16, color: "#64748b" }} />
            <Typography variant="body2" fontWeight={700} sx={{ color: "#1e293b" }}>
              {ret.consignee_name}
            </Typography>
          </Box>
        </Box>

        <Chip
          label={isReceived ? "Received" : "Awaiting Parcel"}
          size="small"
          sx={{
            fontWeight: 700,
            ...(isReceived
              ? { bgcolor: "#f0fdf4", color: "#15803d", border: "1px solid #dcfce7" }
              : { bgcolor: "#fff7ed", color: "#c2410c", border: "1px solid #fed7aa" }),
          }}
        />
      </Box>

      {/* REASON FOR RETURN */}
      <Box sx={{ p: 3, pb: 2 }}>
        <Typography
          variant="caption"
          fontWeight={700}
          sx={{ color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}
        >
          Reason for Return
        </Typography>
        <Typography variant="body2" sx={{ color: "#334155", mt: 0.5, lineHeight: 1.6 }}>
          {ret.reason || ret.return_reason || "No specific reason provided."}
        </Typography>
      </Box>

      {/* ITEMS LIST */}
      <Box sx={{ px: 3, pb: 2 }}>
        <Typography
          variant="caption"
          fontWeight={700}
          sx={{ color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}
        >
          Items to Restock ({itemCount})
        </Typography>
        <List disablePadding sx={{ mt: 1 }}>
          {ret.items?.map((item, i) => (
            <ListItem
              key={`${ret.order_id}-${item.product_id}-${i}`}
              disableGutters
              sx={{
                py: 1,
                px: 2,
                mb: 1,
                borderRadius: "10px",
                bgcolor: "#f8fafc",
                border: "1px solid #f1f5f9",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="body2" fontWeight={700} sx={{ color: "#1e293b" }}>
                {item.product_name}
              </Typography>
              <Chip
                label={`× ${item.quantity}`}
                size="small"
                sx={{
                  fontWeight: 700,
                  bgcolor: "#eff6ff",
                  color: "#1d4ed8",
                  border: "1px solid #bfdbfe",
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      <Divider sx={{ borderColor: "#e2e8f0" }} />

      {/* ACTION FOOTER WITH RECEIVE ORDER BUTTON / DATE DISPLAY */}
      <Box sx={{ p: 2.5, px: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {isReceived ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <EventAvailableRoundedIcon sx={{ fontSize: 18, color: "#15803d" }} />
            <Typography variant="body2" sx={{ color: "#15803d", fontWeight: 700 }}>
              Received Date:{" "}
              {ret.received_date || ret.received_at
                ? new Date(ret.received_date || ret.received_at).toLocaleDateString(
                    undefined,
                    { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }
                  )
                : "—"}
            </Typography>
          </Box>
        ) : (
          <Typography variant="caption" sx={{ color: "#94a3b8" }}>
            Click button to confirm delivery arrival and insert today's date.
          </Typography>
        )}

        {!isReceived && (
          <Button
            onClick={onReceiveClick}
            disabled={isUpdating}
            startIcon={
              isUpdating ? (
                <CircularProgress size={16} sx={{ color: "#fff" }} />
              ) : (
                <InventoryOutlinedIcon sx={{ fontSize: 18 }} />
              )
            }
            sx={{
              textTransform: "none",
              fontWeight: 700,
              fontSize: "0.88rem",
              borderRadius: "10px",
              px: 3,
              py: 1,
              color: "#fff",
              bgcolor: "#16a34a",
              "&:hover": { bgcolor: "#15803d" },
              "&.Mui-disabled": { bgcolor: "#e2e8f0", color: "#94a3b8" },
            }}
          >
            Receive Order
          </Button>
        )}
      </Box>
    </Paper>
  );
}

function EmptyState({ text }) {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: "16px",
        border: "1px solid #e2e8f0",
        bgcolor: "#fff",
        p: 8,
        textAlign: "center",
      }}
    >
      <AssignmentReturnOutlinedIcon
        sx={{ fontSize: 48, color: "#cbd5e1", mb: 1 }}
      />
      <Typography variant="subtitle1" fontWeight={700} sx={{ color: "#334155" }}>
        {text}
      </Typography>
    </Paper>
  );
}