import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  Divider,
  Chip,
  List,
  ListItem,
  CircularProgress,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Rating,
  Snackbar,
  Alert,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import PaymentIcon from "@mui/icons-material/Payment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CancelIcon from "@mui/icons-material/Cancel";
import BlockIcon from "@mui/icons-material/Block";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import RateReviewIcon from "@mui/icons-material/RateReview";
import AssignmentReturnOutlinedIcon from "@mui/icons-material/AssignmentReturnOutlined";

// ── Design tokens — same manifest palette as Checkout / Navbar ─
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

const TRACK_STEPS = ["Processing", "Packed", "Shipped", "Delivered"];

const DEACTIVATE_REASONS = [
  "Changed my mind",
  "Found a better price elsewhere",
  "Ordered by mistake",
  "Delivery is taking too long",
  "Other",
];

function stepIndexFor(status) {
  if (!status) return 0;
  const idx = TRACK_STEPS.findIndex(
    (s) => s.toLowerCase() === String(status).toLowerCase()
  );
  return idx === -1 ? 0 : idx;
}

const API_BASE = "http://localhost:5000/api/shipping";

export default function ShippingDetails() {
  useManifestFonts();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  const showToast = (message, severity = "success") =>
    setToast({ open: true, message, severity });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    let user;
    try {
      user = JSON.parse(storedUser);
    } catch (e) {
      console.error("Stored user parse error:", e);
      navigate("/login");
      return;
    }

    if (!user?.email) {
      navigate("/login");
      return;
    }

    fetchOrders(user.email);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const fetchOrders = async (email) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE}/my-orders/${encodeURIComponent(email)}`
      );

      if (response.data?.success) {
        setOrders(response.data.orders || []);
      } else {
        setError(response.data?.message || "Could not load shipping details.");
      }
    } catch (err) {
      console.error("Shipping details fetch error:", err);
      setError(
        err.response?.data?.message ||
          "Could not reach the server to load your shipments."
      );
    } finally {
      setLoading(false);
    }
  };

  // ── Order-level actions ──────────────────────────────────────

  const handleConfirmDelivery = async (order) => {
    try {
      const res = await axios.put(`${API_BASE}/confirm-delivery/${order.order_id}`);
      if (res.data?.success) {
        setOrders((prev) =>
          prev.map((o) =>
            o.order_id === order.order_id
              ? { ...o, shipping_status: "Delivered", order_shipping_status: "Delivered" }
              : o
          )
        );
        return true;
      }
      showToast(res.data?.message || "Couldn't confirm delivery.", "error");
      return false;
    } catch (err) {
      console.error("Confirm delivery error:", err);
      showToast(
        err.response?.data?.message || "Couldn't confirm delivery. Try again.",
        "error"
      );
      return false;
    }
  };

  const handleDeleteOrder = async (order) => {
    try {
      const res = await axios.delete(`${API_BASE}/delete-order/${order.order_id}`);
      if (res.data?.success) {
        setOrders((prev) => prev.filter((o) => o.order_id !== order.order_id));
        showToast("Order removed from your history.");
      } else {
        showToast(res.data?.message || "Couldn't delete this order.", "error");
      }
    } catch (err) {
      console.error("Delete order error:", err);
      showToast(
        err.response?.data?.message || "Couldn't delete this order. Try again.",
        "error"
      );
    }
  };

  const handleSubmitReview = async (order, { rating, comment }) => {
    const user = JSON.parse(localStorage.getItem("user"));

    try {
      const res = await axios.post(`${API_BASE}/reviews/add`, {
        order_id: order.order_id,
        user_email: user?.email,
        rating: rating,
        review: comment,
      });

      return res.data?.success;
    } catch (err) {
      console.error("Submit review error:", err);
      showToast(
        err.response?.data?.message || "Couldn't submit review.",
        "error"
      );
      return false;
    }
  };

  const handleSubmitReturn = async (order, { reason }) => {
    const user = JSON.parse(localStorage.getItem("user"));

    try {
      const res = await axios.post(`${API_BASE}/return`, {
        order_id: order.order_id,
        user_email: user?.email,
        reason,
      });

      if (res.data?.success) {
        setOrders((prev) =>
          prev.map((o) =>
            o.order_id === order.order_id
              ? {
                  ...o,
                  shipping_status: "Return Requested",
                }
              : o
          )
        );
        showToast("Return request submitted.");
      }
    } catch (err) {
      showToast(
        err.response?.data?.message || "Return request failed.",
        "error"
      );
    }
  };

  const handleDeactivateOrder = async (order, { reason }) => {
    try {
      const res = await axios.put(`${API_BASE}/deactivate-order/${order.order_id}`, {
        reason,
      });
      if (res.data?.success) {
        setOrders((prev) =>
          prev.map((o) =>
            o.order_id === order.order_id
              ? {
                  ...o,
                  shipping_status: "Deactivated",
                  order_shipping_status: "Deactivated",
                  is_active: false,
                }
              : o
          )
        );
        showToast("Order deactivated.");
        return true;
      }
      showToast(res.data?.message || "Couldn't deactivate this order.", "error");
      return false;
    } catch (err) {
      console.error("Deactivate order error:", err);
      showToast(
        err.response?.data?.message || "Couldn't deactivate this order. Try again.",
        "error"
      );
      return false;
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: c.bg, pb: 10 }}>
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          backgroundImage: `radial-gradient(${c.border} 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
          opacity: 0.6,
        }}
      />

      <Container maxWidth="md" sx={{ pt: 6, position: "relative", color: c.text }}>
        <Button
          startIcon={<ArrowBackIcon sx={{ fontSize: 18 }} />}
          onClick={() => navigate("/Productandservicehome")}
          sx={{
            color: c.textMuted,
            mb: 5,
            textTransform: "none",
            fontFamily: monoFont,
            fontSize: "0.8rem",
            letterSpacing: "0.03em",
            "&:hover": { color: c.accent, bgcolor: "transparent" },
          }}
        >
          back to catalog
        </Button>

        <Box sx={{ mb: 5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
            <Box sx={{ width: 6, height: 6, bgcolor: c.accent, borderRadius: "50%" }} />
            <Typography
              sx={{
                fontFamily: monoFont,
                fontSize: "0.75rem",
                letterSpacing: "0.14em",
                color: c.accent,
                textTransform: "uppercase",
              }}
            >
              Consignment Log
            </Typography>
          </Box>
          <Typography
            sx={{
              fontFamily: displayFont,
              fontWeight: 700,
              fontSize: { xs: "2rem", sm: "2.6rem" },
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
            }}
          >
            Shipping Details
          </Typography>
          <Typography sx={{ color: c.textMuted, mt: 1, fontSize: "0.95rem" }}>
            Track every order you've dispatched through AgroTech.
          </Typography>
        </Box>

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
            <CircularProgress sx={{ color: c.accent }} />
          </Box>
        )}

        {!loading && error && (
          <Card
            sx={{
              bgcolor: c.surface,
              border: `1px solid ${c.border}`,
              borderRadius: "16px",
              p: 4,
              textAlign: "center",
              backgroundImage: "none",
              boxShadow: c.shadow,
            }}
          >
            <Typography sx={{ color: c.danger, fontWeight: 600 }}>{error}</Typography>
          </Card>
        )}

        {!loading && !error && orders.length === 0 && (
          <Card
            sx={{
              bgcolor: c.surface,
              border: `1px solid ${c.border}`,
              borderRadius: "16px",
              p: 6,
              textAlign: "center",
              backgroundImage: "none",
              boxShadow: c.shadow,
            }}
          >
            <Inventory2Icon sx={{ fontSize: 44, color: c.textFaint, mb: 2 }} />
            <Typography sx={{ fontWeight: 700, color: c.text, mb: 0.5 }}>
              No shipments yet
            </Typography>
            <Typography sx={{ color: c.textMuted, fontSize: "0.9rem" }}>
              Orders you place will show up here with live tracking.
            </Typography>
          </Card>
        )}

        {!loading &&
          !error &&
          orders.map((order) => (
            <OrderTrackingCard
              key={order.order_id}
              order={order}
              onConfirmDelivery={handleConfirmDelivery}
              onDeleteOrder={handleDeleteOrder}
              onSubmitReview={handleSubmitReview}
              onSubmitReturn={handleSubmitReturn}
              onDeactivateOrder={handleDeactivateOrder}
            />
          ))}
      </Container>

      <Snackbar
        open={toast.open}
        autoHideDuration={3500}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToast((t) => ({ ...t, open: false }))}
          severity={toast.severity}
          variant="filled"
          sx={{ fontFamily: monoFont, fontSize: "0.82rem" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

// ── Sub-components ─────────────────────────────────────────────

function OrderTrackingCard({
  order,
  onConfirmDelivery,
  onDeleteOrder,
  onSubmitReview,
  onSubmitReturn,
  onDeactivateOrder,
}) {
  const status = (order.shipping_status || order.order_shipping_status || "").toLowerCase();
  const isCancelled = status === "cancelled";
  const isDeactivated = status === "deactivated";
  const isDelivered = status === "delivered";
  const isShipped = status === "shipped";

  const isReturnRequested = status === "return requested";
  const isTerminal = isCancelled || isDeactivated;

  // Deactivating is only allowed while the order hasn't shipped yet.
  const canDeactivate =
    (status === "processing" || status === "packed") && order.is_active !== false;

  const currentStep = stepIndexFor(order.shipping_status || order.order_shipping_status);

  const orderDate = order.order_date
    ? new Date(order.order_date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

  // Menu (kebab) state
  const [menuAnchor, setMenuAnchor] = useState(null);
  const menuOpen = Boolean(menuAnchor);

  // Dialog state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [confirmDeliveryOpen, setConfirmDeliveryOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewSuccessOpen, setReviewSuccessOpen] = useState(false);
  const [returnOpen, setReturnOpen] = useState(false);
  const [deactivateOpen, setDeactivateOpen] = useState(false);

  const statusChipStyles = isCancelled || isDeactivated
    ? { color: c.danger, bg: "rgba(214,69,69,0.08)", border: "rgba(214,69,69,0.4)" }
    : { color: c.accent, bg: c.accentDim, border: c.borderStrong };

  return (
    <Card
      sx={{
        bgcolor: c.surface,
        border: `1px solid ${c.border}`,
        borderRadius: "16px",
        mb: 3.5,
        p: { xs: 2.5, sm: 3.5 },
        backgroundImage: "none",
        boxShadow: c.shadow,
        opacity: isTerminal ? 0.75 : 1,
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 1.5,
          mb: 3,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontFamily: monoFont,
              fontSize: "0.7rem",
              color: c.textFaint,
              letterSpacing: "0.1em",
            }}
          >
            ORDER #{order.order_id} · {orderDate}
          </Typography>
          <Typography sx={{ fontFamily: displayFont, fontWeight: 700, fontSize: "1.1rem", mt: 0.3 }}>
            Tracking Number: {order.tracking_number || "Waybill pending"}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Chip
            icon={
              isDeactivated ? (
                <BlockIcon sx={{ fontSize: 16 }} />
              ) : isCancelled ? (
                <CancelIcon sx={{ fontSize: 16 }} />
              ) : (
                <LocalShippingIcon sx={{ fontSize: 16 }} />
              )
            }
            label={order.shipping_status || order.order_shipping_status || "Processing"}
            sx={{
              fontFamily: monoFont,
              fontWeight: 700,
              fontSize: "0.75rem",
              color: statusChipStyles.color,
              bgcolor: statusChipStyles.bg,
              border: `1px solid ${statusChipStyles.border}`,
            }}
          />

          <Button
            size="small"
            onClick={(e) => setMenuAnchor(e.currentTarget)}
            sx={{
              minWidth: 0,
              width: 32,
              height: 32,
              borderRadius: "8px",
              color: c.textMuted,
              border: `1px solid ${c.border}`,
              "&:hover": { color: c.text, bgcolor: c.surfaceSunken },
            }}
          >
            <MoreVertIcon sx={{ fontSize: 18 }} />
          </Button>

          <Menu
            anchorEl={menuAnchor}
            open={menuOpen}
            onClose={() => setMenuAnchor(null)}
            PaperProps={{
              sx: {
                border: `1px solid ${c.border}`,
                borderRadius: "10px",
                boxShadow: c.shadow,
                minWidth: 200,
              },
            }}
          >
            <MenuItem
              onClick={() => {
                setMenuAnchor(null);
                setDeleteOpen(true);
              }}
              sx={{ fontSize: "0.85rem", color: c.danger, gap: 1.2 }}
            >
              <DeleteOutlineIcon sx={{ fontSize: 18 }} />
              Delete order history
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* TRACKING STEPPER */}
      {!isTerminal && !isReturnRequested && (
        <Box sx={{ mb: 3.5 }}>
          <TrackingStepper currentStep={currentStep} />
        </Box>
      )}

      {isDeactivated && (
        <Box
          sx={{
            mb: 3,
            p: 1.6,
            borderRadius: "10px",
            bgcolor: "rgba(214,69,69,0.06)",
            border: "1px solid rgba(214,69,69,0.25)",
          }}
        >
          <Typography sx={{ fontSize: "0.82rem", color: c.danger }}>
            You deactivated this order{order.deactivation_reason ? ` — ${order.deactivation_reason}` : ""}.
          </Typography>
        </Box>
      )}

      <Divider sx={{ borderStyle: "dashed", borderColor: c.border, mb: 3 }} />

      {/* SHIPPING + PAYMENT INFO */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: 3,
          mb: 3,
        }}
      >
        <InfoBlock icon={<LocalShippingIcon />} title="Delivering to">
          <Typography sx={{ fontWeight: 700, fontSize: "0.92rem", color: c.text }}>
            {order.shipping_name || order.consignee_name}
          </Typography>
          <Typography sx={{ fontSize: "0.82rem", color: c.textMuted, mt: 0.3 }}>
            {order.shipping_address || order.address}
          </Typography>
          <Typography sx={{ fontSize: "0.82rem", color: c.textMuted }}>
            {(order.shipping_city || order.city)}
            {order.shipping_postal_code || order.postal_code
              ? `, ${order.shipping_postal_code || order.postal_code}`
              : ""}
          </Typography>
        </InfoBlock>

        <InfoBlock icon={<PaymentIcon />} title="Payment">
          <Typography sx={{ fontWeight: 700, fontSize: "0.92rem", color: c.text }}>
            {order.payment_method?.toUpperCase() === "COD"
              ? "Cash on Dispatch"
              : order.payment_method || "—"}
          </Typography>
          <Typography sx={{ fontSize: "0.82rem", color: c.textMuted, mt: 0.3 }}>
            Status: {order.payment_status || "Pending"}
          </Typography>
          <Typography
            sx={{ fontFamily: monoFont, fontSize: "0.85rem", color: c.accent, mt: 0.6 }}
          >
            Rs. {Number(order.total_amount).toLocaleString()}
          </Typography>
        </InfoBlock>
      </Box>

      {/* ITEMS */}
      {order.items?.length > 0 && (
        <>
          <Typography
            sx={{
              fontFamily: monoFont,
              fontSize: "0.7rem",
              color: c.textFaint,
              letterSpacing: "0.1em",
              mb: 1,
            }}
          >
            ITEMS ({order.items.length})
          </Typography>
          <List disablePadding>
            {order.items.map((item, i) => (
              <ListItem
                key={`${order.order_id}-${item.product_id}-${i}`}
                disableGutters
                sx={{
                  py: 1,
                  borderTop: i === 0 ? "none" : `1px dotted ${c.border}`,
                  justifyContent: "space-between",
                }}
              >
                <Typography sx={{ fontSize: "0.88rem", color: c.text }}>
                  {item.product_name}{" "}
                  <Box component="span" sx={{ color: c.textFaint, fontFamily: monoFont, fontSize: "0.78rem" }}>
                    × {item.quantity}
                  </Box>
                </Typography>
                <Typography sx={{ fontFamily: monoFont, fontSize: "0.85rem", color: c.textMuted }}>
                  Rs. {(Number(item.price) * item.quantity).toLocaleString()}
                </Typography>
              </ListItem>
            ))}
          </List>
        </>
      )}

      {/* ACTIONS */}
      {!isTerminal && (
        <>
          <Divider sx={{ borderStyle: "dashed", borderColor: c.border, my: 3 }} />
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.2 }}>
            {isShipped && (
              <ActionButton
                icon={<DoneAllIcon sx={{ fontSize: 16 }} />}
                label="Confirm Delivery"
                primary
                onClick={() => setConfirmDeliveryOpen(true)}
              />
            )}

            {isDelivered && (
              <ActionButton
                icon={<RateReviewIcon sx={{ fontSize: 16 }} />}
                label="Leave a Review"
                primary={!isShipped}
                onClick={() => setReviewOpen(true)}
              />
            )}

            {isDelivered && (
              <ActionButton
                icon={<AssignmentReturnOutlinedIcon sx={{ fontSize: 16 }} />}
                label="Request Return"
                onClick={() => setReturnOpen(true)}
              />
            )}

            {canDeactivate && (
              <ActionButton
                icon={<BlockIcon sx={{ fontSize: 16 }} />}
                label="Deactivate Order"
                danger
                onClick={() => setDeactivateOpen(true)}
              />
            )}
          </Box>
        </>
      )}

      {/* DIALOGS */}
      <ConfirmDialog
        open={deleteOpen}
        title="Delete this order from your history?"
        description="This only removes it from your view — it won't cancel or refund an active shipment."
        confirmLabel="Delete"
        danger
        onCancel={() => setDeleteOpen(false)}
        onConfirm={() => {
          setDeleteOpen(false);
          onDeleteOrder(order);
        }}
      />

      {/* Step 1 — confirm the parcel actually arrived */}
      <ConfirmDialog
        open={confirmDeliveryOpen}
        title="Confirm delivery?"
        description="Let us know your parcel arrived so we can close out shipping. You'll be able to leave a quick review right after."
        confirmLabel="Yes, it arrived"
        onCancel={() => setConfirmDeliveryOpen(false)}
        onConfirm={async () => {
          setConfirmDeliveryOpen(false);
          const ok = await onConfirmDelivery(order);
          if (ok) setReviewOpen(true);
        }}
      />

      {/* Step 2 — review modal */}
      <ReviewDialog
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        onSubmit={async (payload) => {
          const ok = await onSubmitReview(order, payload);
          setReviewOpen(false);
          if (ok) setReviewSuccessOpen(true);
        }}
      />

      {/* Step 3 — review success confirmation */}
      <SuccessDialog
        open={reviewSuccessOpen}
        title="Review submitted"
        description="Thanks for sharing your experience — it helps other buyers and our team both."
        onClose={() => setReviewSuccessOpen(false)}
      />

      <ReturnDialog
        open={returnOpen}
        onClose={() => setReturnOpen(false)}
        onSubmit={(payload) => {
          setReturnOpen(false);
          onSubmitReturn(order, payload);
        }}
      />

      <DeactivateDialog
        open={deactivateOpen}
        onClose={() => setDeactivateOpen(false)}
        onSubmit={(payload) => {
          setDeactivateOpen(false);
          onDeactivateOrder(order, payload);
        }}
      />
    </Card>
  );
}

function ActionButton({ icon, label, onClick, primary, danger }) {
  return (
    <Button
      onClick={onClick}
      startIcon={icon}
      sx={{
        textTransform: "none",
        fontFamily: monoFont,
        fontSize: "0.78rem",
        fontWeight: 600,
        borderRadius: "8px",
        px: 1.8,
        py: 0.8,
        color: primary ? "#fff" : danger ? c.danger : c.text,
        bgcolor: primary ? c.accent : "transparent",
        border: `1px solid ${primary ? c.accent : danger ? "rgba(214,69,69,0.4)" : c.border}`,
        "&:hover": {
          bgcolor: primary ? c.accentBright : danger ? "rgba(214,69,69,0.08)" : c.surfaceSunken,
          borderColor: primary ? c.accentBright : danger ? c.danger : c.border,
        },
      }}
    >
      {label}
    </Button>
  );
}

function InfoBlock({ icon, title, children }) {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: "12px",
        bgcolor: c.surfaceSunken,
        border: `1px solid ${c.border}`,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <Box sx={{ color: c.accent, display: "flex", "& svg": { fontSize: 16 } }}>{icon}</Box>
        <Typography
          sx={{
            fontFamily: monoFont,
            fontSize: "0.68rem",
            color: c.textFaint,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {title}
        </Typography>
      </Box>
      {children}
    </Box>
  );
}

function TrackingStepper({ currentStep }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      {TRACK_STEPS.map((step, i) => {
        const done = i < currentStep;
        const active = i === currentStep;
        const isLast = i === TRACK_STEPS.length - 1;

        return (
          <React.Fragment key={step}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 64 }}>
              <Box
                sx={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: done || active ? c.accent : c.surfaceSunken,
                  border: `1.5px solid ${done || active ? c.accent : c.border}`,
                  color: done || active ? "#fff" : c.textFaint,
                  transition: "all 0.2s ease",
                }}
              >
                {done ? (
                  <CheckCircleIcon sx={{ fontSize: 16 }} />
                ) : active ? (
                  <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#fff" }} />
                ) : (
                  <RadioButtonUncheckedIcon sx={{ fontSize: 14 }} />
                )}
              </Box>
              <Typography
                sx={{
                  fontFamily: monoFont,
                  fontSize: "0.62rem",
                  mt: 0.7,
                  textAlign: "center",
                  color: done || active ? c.accent : c.textFaint,
                  fontWeight: active ? 700 : 500,
                  lineHeight: 1.2,
                }}
              >
                {step}
              </Typography>
            </Box>

            {!isLast && (
              <Box
                sx={{
                  flexGrow: 1,
                  height: 2,
                  mb: 2.2,
                  bgcolor: i < currentStep ? c.accent : c.border,
                  transition: "background-color 0.2s ease",
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </Box>
  );
}

// ── Dialogs ───────────────────────────────────────────────────

const dialogPaperSx = {
  borderRadius: "16px",
  border: `1px solid ${c.border}`,
  boxShadow: c.shadow,
  backgroundImage: "none",
  p: 0.5,
};

const dialogTitleSx = {
  fontFamily: displayFont,
  fontWeight: 700,
  fontSize: "1.1rem",
  color: c.text,
};

function DialogActionBtn({ children, onClick, primary, danger, disabled }) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      sx={{
        textTransform: "none",
        fontFamily: monoFont,
        fontWeight: 700,
        fontSize: "0.8rem",
        borderRadius: "8px",
        px: 2,
        color: primary ? "#fff" : danger ? c.danger : c.textMuted,
        bgcolor: primary ? c.accent : "transparent",
        "&:hover": {
          bgcolor: primary ? c.accentBright : danger ? "rgba(214,69,69,0.08)" : c.surfaceSunken,
        },
      }}
    >
      {children}
    </Button>
  );
}

function ConfirmDialog({ open, title, description, confirmLabel, danger, onCancel, onConfirm }) {
  return (
    <Dialog open={open} onClose={onCancel} PaperProps={{ sx: dialogPaperSx }} maxWidth="xs" fullWidth>
      <DialogTitle sx={dialogTitleSx}>{title}</DialogTitle>
      <DialogContent>
        <Typography sx={{ color: c.textMuted, fontSize: "0.88rem" }}>{description}</Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <DialogActionBtn onClick={onCancel}>Cancel</DialogActionBtn>
        <DialogActionBtn onClick={onConfirm} danger={danger} primary={!danger}>
          {confirmLabel}
        </DialogActionBtn>
      </DialogActions>
    </Dialog>
  );
}

function SuccessDialog({ open, title, description, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ sx: dialogPaperSx }} maxWidth="xs" fullWidth>
      <DialogContent sx={{ textAlign: "center", pt: 4, pb: 1 }}>
        <CheckCircleOutlineIcon sx={{ fontSize: 46, color: c.accent, mb: 1.5 }} />
        <Typography sx={{ ...dialogTitleSx, mb: 0.8 }}>{title}</Typography>
        <Typography sx={{ color: c.textMuted, fontSize: "0.86rem" }}>{description}</Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, justifyContent: "center" }}>
        <DialogActionBtn primary onClick={onClose}>
          Done
        </DialogActionBtn>
      </DialogActions>
    </Dialog>
  );
}

function ReviewDialog({ open, onClose, onSubmit }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} PaperProps={{ sx: dialogPaperSx }} maxWidth="xs" fullWidth>
      <DialogTitle sx={dialogTitleSx}>Delivered! Leave a review?</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 0.5 }}>
          <Rating
            value={rating}
            onChange={(_, v) => setRating(v || 0)}
            sx={{ color: c.accent }}
          />
          <TextField
            multiline
            minRows={3}
            placeholder="How was your experience with this order?"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <DialogActionBtn onClick={handleClose}>Skip</DialogActionBtn>
        <DialogActionBtn
          primary
          onClick={() => {
            onSubmit({ rating, comment });
            setComment("");
          }}
        >
          Submit Review
        </DialogActionBtn>
      </DialogActions>
    </Dialog>
  );
}

function ReturnDialog({ open, onClose, onSubmit }) {
  const [reason, setReason] = useState("");

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} PaperProps={{ sx: dialogPaperSx }} maxWidth="xs" fullWidth>
      <DialogTitle sx={dialogTitleSx}>Request a return</DialogTitle>
      <DialogContent>
        <TextField
          label="Reason for return"
          multiline
          minRows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          fullWidth
          sx={{ mt: 0.5 }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <DialogActionBtn onClick={handleClose}>Cancel</DialogActionBtn>
        <DialogActionBtn
          primary
          disabled={!reason.trim()}
          onClick={() => {
            onSubmit({ reason });
            setReason("");
          }}
        >
          Submit Request
        </DialogActionBtn>
      </DialogActions>
    </Dialog>
  );
}

function DeactivateDialog({ open, onClose, onSubmit }) {
  const [reason, setReason] = useState(DEACTIVATE_REASONS[0]);
  const [otherText, setOtherText] = useState("");

  const isOther = reason === "Other";
  const finalReasonValid = isOther ? otherText.trim().length > 0 : true;

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} PaperProps={{ sx: dialogPaperSx }} maxWidth="xs" fullWidth>
      <DialogTitle sx={dialogTitleSx}>Deactivate this order?</DialogTitle>
      <DialogContent>
        <Typography sx={{ color: c.textMuted, fontSize: "0.85rem", mb: 2 }}>
          This order hasn't shipped yet, so you can still pull it. Tell us why:
        </Typography>

        <RadioGroup value={reason} onChange={(e) => setReason(e.target.value)}>
          {DEACTIVATE_REASONS.map((r) => (
            <FormControlLabel
              key={r}
              value={r}
              control={
                <Radio
                  size="small"
                  sx={{
                    color: c.border,
                    "&.Mui-checked": { color: c.accent },
                  }}
                />
              }
              label={<Typography sx={{ fontSize: "0.88rem", color: c.text }}>{r}</Typography>}
            />
          ))}
        </RadioGroup>

        {isOther && (
          <TextField
            placeholder="Tell us a bit more"
            value={otherText}
            onChange={(e) => setOtherText(e.target.value)}
            multiline
            minRows={2}
            fullWidth
            sx={{ mt: 1 }}
          />
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <DialogActionBtn onClick={handleClose}>Keep Order</DialogActionBtn>
        <DialogActionBtn
          danger
          disabled={!finalReasonValid}
          onClick={() => {
            onSubmit({ reason: isOther ? otherText.trim() : reason });
            setReason(DEACTIVATE_REASONS[0]);
            setOtherText("");
          }}
        >
          Deactivate Order
        </DialogActionBtn>
      </DialogActions>
    </Dialog>
  );
}