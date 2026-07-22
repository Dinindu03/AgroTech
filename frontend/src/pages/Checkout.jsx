import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Grid,
  Card,
  Typography,
  Button,
  TextField,
  Container,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  List,
  ListItem,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PaymentIcon from "@mui/icons-material/Payment";

// ── Design tokens — light manifest palette ─────────────────────
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

function Checkout({ cart, cartTotalPrice, setCart, setSnackbar }) {
  useManifestFonts();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const navigate = useNavigate();

  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const waybillNo = useMemo(
    () => `LK-${Math.floor(100000 + Math.random() * 899999)}`,
    []
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const shippingCost = cartTotalPrice > 15000 ? 0 : 450;
  const grandTotal = cartTotalPrice + shippingCost;

  // Clears the persisted, per-user cart from localStorage (if present)
  // so it doesn't reappear after this successful order.
  const clearPersistedCart = () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user?.email) {
          localStorage.removeItem(`cart_${user.email}`);
        }
      }
    } catch (storageErr) {
      console.error("Cart storage clear error:", storageErr);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    const missingIdItem = cart.find(
      (item) => !(item.product_id || item.id || item._id)
    );

    if (missingIdItem) {
      console.error("Cart item missing a product identifier:", missingIdItem);
      setSnackbar({
        open: true,
        message: `"${missingIdItem.name}" is missing a product ID — please remove it from your cart and re-add it.`,
      });
      return;
    }

    const orderPayload = {
      consigneeName: shippingInfo.fullName,
      email: shippingInfo.email,
      phone: shippingInfo.phone,
      address: shippingInfo.address,
      city: shippingInfo.city,
      postalCode: shippingInfo.postalCode,
      paymentMethod,
      subtotal: cartTotalPrice,
      shippingFee: shippingCost,
      totalAmount: grandTotal,
      items: cart.map((item) => ({
        productId: item.product_id || item.id || item._id,
        productName: item.name,
        quantity: item.quantity,
        price: Number(item.price),
      })),
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/orders/create",
        orderPayload
      );

      if (response.status === 200 || response.status === 201) {
        setSnackbar({
          open: true,
          message: "Order logged inside transactional database successfully!",
        });

        // Clear cart from React state...
        setCart([]);

        // ...and from persisted storage, so a refresh or re-login
        // doesn't bring the old cart back.
        clearPersistedCart();

        navigate("/Productandservicehome");
      }
    } catch (err) {
      console.error("Axios request failure logging details:", err);
      setSnackbar({
        open: true,
        message:
          err.response?.data?.message ||
          "Critical error establishing gateway connection.",
      });
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

      <Container maxWidth="lg" sx={{ pt: 6, position: "relative", color: c.text }}>
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

        <Box sx={{ mb: 6 }}>
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
              Waybill No. {waybillNo}
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
            Checkout Manifest
          </Typography>
          <Typography sx={{ color: c.textMuted, mt: 1, fontSize: "0.95rem" }}>
            {cart.length} item{cart.length !== 1 ? "s" : ""} cleared for dispatch
          </Typography>
        </Box>

        <Box component="form" onSubmit={handlePlaceOrder}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={7}>
              <SectionCard step="01" icon={<LocalShippingIcon />} title="Delivery Logistics">
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <StyledField name="fullName" label="Full consignee name" required value={shippingInfo.fullName} onChange={handleInputChange} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <StyledField name="email" type="email" label="Contact email" required value={shippingInfo.email} onChange={handleInputChange} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <StyledField name="phone" label="Phone number" required value={shippingInfo.phone} onChange={handleInputChange} />
                  </Grid>
                  <Grid item xs={12}>
                    <StyledField name="address" label="Destination street address" required multiline rows={2} value={shippingInfo.address} onChange={handleInputChange} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <StyledField name="city" label="Hub city" required value={shippingInfo.city} onChange={handleInputChange} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <StyledField name="postalCode" label="Routing postal code" required value={shippingInfo.postalCode} onChange={handleInputChange} />
                  </Grid>
                </Grid>
              </SectionCard>

              <SectionCard step="02" icon={<PaymentIcon />} title="Settlement Method">
                <FormControl component="fieldset" fullWidth>
                  <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                    <PaymentOption
                      value="card"
                      selected={paymentMethod === "card"}
                      title="Credit / debit card"
                      caption="Instant automated processing via secure tokens."
                    />
                    <PaymentOption
                      value="cod"
                      selected={paymentMethod === "cod"}
                      title="Cash on dispatch (COD)"
                      caption="Pay physically with regional notes on arrival."
                    />
                  </RadioGroup>
                </FormControl>

                {paymentMethod === "card" && (
                  <Box sx={{ mt: 3, pt: 3, borderTop: `1px dashed ${c.border}` }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <StyledField label="Card number" required placeholder="XXXX XXXX XXXX XXXX" />
                      </Grid>
                      <Grid item xs={6}>
                        <StyledField label="Expiry" required placeholder="MM/YY" />
                      </Grid>
                      <Grid item xs={6}>
                        <StyledField label="CVV" required placeholder="XYZ" />
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </SectionCard>
            </Grid>

            <Grid item xs={12} md={5}>
              <Box sx={{ position: "sticky", top: 24 }}>
                <ManifestStub
                  cart={cart}
                  cartTotalPrice={cartTotalPrice}
                  shippingCost={shippingCost}
                  grandTotal={grandTotal}
                  waybillNo={waybillNo}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={cart.length === 0}
                  sx={{
                    mt: 2.5,
                    py: 1.7,
                    borderRadius: "10px",
                    fontWeight: 700,
                    textTransform: "none",
                    fontSize: "1rem",
                    fontFamily: displayFont,
                    color: "#ffffff",
                    bgcolor: c.accent,
                    boxShadow: `0 8px 24px rgba(70,161,29,0.22)`,
                    "&:hover": { bgcolor: "#357f13" },
                    "&.Mui-disabled": {
                      bgcolor: c.surfaceSunken,
                      color: c.textFaint,
                    },
                  }}
                >
                  Authorize &amp; Confirm Order →
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

// ── Sub-components ─────────────────────────────────────────────

function SectionCard({ step, icon, title, children }) {
  return (
    <Card
      sx={{
        bgcolor: c.surface,
        border: `1px solid ${c.border}`,
        borderRadius: "16px",
        mb: 4,
        p: { xs: 2.5, sm: 3.5 },
        backgroundImage: "none",
        boxShadow: c.shadow,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
        <Typography
          sx={{
            fontFamily: monoFont,
            fontSize: "0.85rem",
            color: c.accent,
            border: `1px solid ${c.borderStrong}`,
            borderRadius: "6px",
            px: 0.9,
            py: 0.1,
          }}
        >
          {step}
        </Typography>
        <Box sx={{ color: c.accent, display: "flex", "& svg": { fontSize: 20 } }}>{icon}</Box>
        <Typography sx={{ fontFamily: displayFont, fontWeight: 700, fontSize: "1.1rem" }}>
          {title}
        </Typography>
      </Box>
      {children}
    </Card>
  );
}

function StyledField(props) {
  return (
    <TextField
      fullWidth
      {...props}
      sx={{
        "& .MuiInputLabel-root": { color: c.textFaint, fontSize: "0.9rem" },
        "& .MuiInputLabel-root.Mui-focused": { color: c.accent },
        "& .MuiOutlinedInput-root": {
          color: c.text,
          borderRadius: "10px",
          backgroundColor: c.surfaceSunken,
          fontSize: "0.95rem",
          "& fieldset": { borderColor: c.border },
          "&:hover fieldset": { borderColor: c.borderStrong },
          "&.Mui-focused fieldset": { borderColor: c.accent, borderWidth: "1px" },
        },
      }}
    />
  );
}

function PaymentOption({ value, selected, title, caption }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        p: 2,
        borderRadius: "12px",
        border: `1px solid ${selected ? c.borderStrong : c.border}`,
        bgcolor: selected ? c.accentDim : "transparent",
        mb: 1.5,
        cursor: "pointer",
        transition: "all 0.15s ease",
      }}
    >
      <FormControlLabel
        value={value}
        control={<Radio sx={{ color: c.textFaint, "&.Mui-checked": { color: c.accent } }} />}
        label={
          <Box sx={{ ml: 0.5 }}>
            <Typography sx={{ fontWeight: 700, fontSize: "0.95rem", color: c.text }}>{title}</Typography>
            <Typography sx={{ color: c.textMuted, fontSize: "0.78rem" }}>{caption}</Typography>
          </Box>
        }
        sx={{ width: "100%", m: 0 }}
      />
    </Box>
  );
}

function ManifestStub({ cart, cartTotalPrice, shippingCost, grandTotal, waybillNo }) {
  return (
    <Card
      sx={{
        position: "relative",
        bgcolor: c.surface,
        border: `1px solid ${c.border}`,
        borderRadius: "18px",
        overflow: "visible",
        backgroundImage: "none",
        boxShadow: c.shadow,
      }}
    >
      <Box sx={{ p: 3.5, pb: 2.5 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
          <Box>
            <Typography sx={{ fontFamily: monoFont, fontSize: "0.7rem", color: c.textFaint, letterSpacing: "0.1em" }}>
              MANIFEST
            </Typography>
            <Typography sx={{ fontFamily: displayFont, fontWeight: 700, fontSize: "1.15rem" }}>
              Order Summary
            </Typography>
          </Box>
          <Typography sx={{ fontFamily: monoFont, fontSize: "0.72rem", color: c.accent, textAlign: "right" }}>
            #{waybillNo}
          </Typography>
        </Box>

        <List disablePadding sx={{ maxHeight: 220, overflowY: "auto", mb: 1 }}>
          {cart.map((item, i) => (
            <ListItem
              key={item.id || item._id}
              disableGutters
              sx={{
                py: 1.2,
                borderTop: i === 0 ? "none" : `1px dotted ${c.border}`,
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ width: "68%" }}>
                <Typography sx={{ fontSize: "0.88rem", fontWeight: 600, lineHeight: 1.3, color: c.text }}>
                  {item.name}
                </Typography>
                <Typography sx={{ fontFamily: monoFont, fontSize: "0.72rem", color: c.textFaint }}>
                  qty {item.quantity}
                </Typography>
              </Box>
              <Typography sx={{ fontFamily: monoFont, fontSize: "0.85rem", color: c.textMuted }}>
                {(Number(item.price) * item.quantity).toLocaleString()}
              </Typography>
            </ListItem>
          ))}
        </List>
      </Box>

      <Box sx={{ position: "relative", height: 0 }}>
        <Box sx={{ position: "absolute", left: -12, top: -10, width: 24, height: 24, borderRadius: "50%", bgcolor: c.bg, border: `1px solid ${c.border}` }} />
        <Box sx={{ position: "absolute", right: -12, top: -10, width: 24, height: 24, borderRadius: "50%", bgcolor: c.bg, border: `1px solid ${c.border}` }} />
        <Divider sx={{ borderStyle: "dashed", borderColor: c.border, mx: 2 }} />
      </Box>

      <Box sx={{ p: 3.5, pt: 3 }}>
        <Row label="Subtotal" value={`Rs. ${cartTotalPrice.toLocaleString()}`} />
        <Row
          label="Logistics fee"
          value={shippingCost === 0 ? "FREE" : `Rs. ${shippingCost}`}
          valueColor={shippingCost === 0 ? c.accent : c.text}
        />
        <Divider sx={{ borderColor: c.border, my: 2 }} />
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <Typography sx={{ fontFamily: displayFont, fontWeight: 700, fontSize: "1rem" }}>
            Total due
          </Typography>
          <Typography sx={{ fontFamily: displayFont, fontWeight: 700, fontSize: "1.7rem", color: c.accent }}>
            Rs. {grandTotal.toLocaleString()}
          </Typography>
        </Box>

        <Barcode value={waybillNo} />
      </Box>
    </Card>
  );
}

function Row({ label, value, valueColor = c.text }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.4 }}>
      <Typography sx={{ color: c.textMuted, fontSize: "0.85rem" }}>{label}</Typography>
      <Typography sx={{ fontFamily: monoFont, fontSize: "0.88rem", color: valueColor }}>
        {value}
      </Typography>
    </Box>
  );
}

function Barcode({ value }) {
  const bars = useMemo(() => {
    const seed = value.split("").map((ch) => ch.charCodeAt(0));
    return seed.map((n) => 2 + (n % 5));
  }, [value]);

  return (
    <Box sx={{ display: "flex", alignItems: "flex-end", gap: "3px", mt: 3, height: 28, opacity: 0.55 }}>
      {bars.map((w, i) => (
        <Box key={i} sx={{ width: w, height: "100%", bgcolor: c.textMuted }} />
      ))}
    </Box>
  );
}

export default Checkout;