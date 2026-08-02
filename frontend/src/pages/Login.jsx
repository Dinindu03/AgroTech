import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
  Grid,
} from "@mui/material";

import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PersonIcon from "@mui/icons-material/Person";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import Navbar from "../components/Navbar";
import logo from "../assets/Logo.png";

// 1. FIXED: Moved inputStyle to the top so it's defined before the component renders
const inputStyle = {
  mb: 1,
  "& .MuiOutlinedInput-root": {
    borderRadius: "14px",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    color: "#ffffff",
    transition: "all 0.3s ease",
    "& fieldset": {
      borderColor: "rgba(255, 255, 255, 0.1)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(255, 255, 255, 0.25)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#64dd17",
      borderWidth: "1.5px",
    },
    "& input::placeholder": {
      color: "rgba(255, 255, 255, 0.4)",
      opacity: 1,
    },
  },
};

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginType, setLoginType] = useState("admin");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint =
        loginType === "admin"
          ? "http://localhost:5000/api/admin/login"
          : "http://localhost:5000/api/users/login";

      const res = await axios.post(endpoint, formData);

      // 2. FIXED: Dynamically extract the data key based on user type 
      // (Assumes your backend sends back { admin: {...} } or { user: {...} })
      const authData = loginType === "admin" ? res.data.admin : res.data.user;
      localStorage.setItem(loginType, JSON.stringify(authData || res.data));

      alert(`${loginType === "admin" ? "Admin" : "User"} Login Successful`);
      navigate(loginType === "admin" ? "/admindashboard" : "/");
    } catch (error) {
      alert(error.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #091418, #0f2b36, #1a3c4a)",
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden",
      }}
    >
      <Navbar />

      {/* Main split-screen wrapper */}
      <Grid 
        container 
        sx={{ 
          flexGrow: 1, 
          minHeight: "calc(100vh - 64px)" 
        }}
      >
        
        {/* LEFT SIDE: Branding and Background Typography */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: { xs: "center", md: "flex-start" },
            pl: { xs: 2, md: 5 },
            pr: 2,
            py: { xs: 6, md: 0 },
            textAlign: { xs: "center", md: "left" },
          }}
        >
          <Box
            sx={{
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                width: "250px",
                height: "250px",
                background: "rgba(100, 221, 23, 0.15)",
                filter: "blur(80px)",
                borderRadius: "50%",
                zIndex: 0,
                top: "-50px",
                left: "-50px"
              }
            }}
          >
            <Box
              component="img"
              src={logo}
              alt="TechAgro Logo"
              sx={{
                height: { xs: 400, md: 500 },
                width: "auto",
                objectFit: "contain",
                mb: 3,
                filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.5))",
                position: "relative",
                zIndex: 1,
              }}
            />
          </Box>
        </Grid>

        {/* RIGHT SIDE: The Frosted Glass Login Panel */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: { xs: 2, sm: 4, md: 6 },
          }}
        >
          <Container maxWidth="xs" sx={{ p: 0 }}>
            <Paper
              elevation={0}
              sx={{
                width: "100%",
                p: { xs: 4, sm: 5 },
                borderRadius: 6,
                backdropFilter: "blur(25px) saturate(170%)",
                WebkitBackdropFilter: "blur(25px) saturate(170%)",
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                boxShadow: "0 20px 50px rgba(0, 0, 0, 0.4)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Role Toggle Switch */}
              <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                <ToggleButtonGroup
                  value={loginType}
                  exclusive
                  onChange={(e, value) => value && setLoginType(value)}
                  sx={{
                    background: "rgba(0, 0, 0, 0.25)",
                    p: 0.5,
                    borderRadius: "14px",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    "& .MuiToggleButton-root": {
                      color: "rgba(255, 255, 255, 0.6)",
                      border: "none",
                      borderRadius: "10px",
                      px: 3,
                      py: 1,
                      textTransform: "capitalize",
                      fontWeight: 600,
                      transition: "all 0.2s ease",
                      "&.Mui-selected": {
                        background: "rgba(255, 255, 255, 0.12)",
                        color: "#64dd17",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                      },
                      "&:hover": {
                        background: "rgba(255, 255, 255, 0.05)",
                      },
                    },
                  }}
                >
                  <ToggleButton value="user">
                    <PersonIcon sx={{ mr: 1, fontSize: 20 }} />
                    User
                  </ToggleButton>
                  <ToggleButton value="admin">
                    <AdminPanelSettingsIcon sx={{ mr: 1, fontSize: 20 }} />
                    Admin
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>

              <Typography
                variant="h6"
                align="center"
                sx={{
                  color: "#fff",
                  fontWeight: 700,
                  letterSpacing: "0.5px",
                  mb: 3,
                }}
              >
                {loginType === "admin" ? "Administrator Portal" : "Secure User Login"}
              </Typography>

              {/* Input Form Fields */}
              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  required
                  name="email"
                  placeholder="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: "rgba(255,255,255,0.4)" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={inputStyle}
                />

                <TextField
                  fullWidth
                  required
                  name="password"
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: "rgba(255,255,255,0.4)" }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: "rgba(255,255,255,0.4)" }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={inputStyle}
                />

                <Button
                  fullWidth
                  type="submit"
                  disabled={loading}
                  sx={{
                    mt: 4,
                    py: 1.8,
                    borderRadius: 3,
                    fontWeight: 700,
                    fontSize: "1rem",
                    textTransform: "none",
                    letterSpacing: "0.5px",
                    background: "linear-gradient(45deg, #00c853, #64dd17)",
                    boxShadow: "0 6px 20px rgba(100, 221, 23, 0.3)",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    color: "#fff",
                    "&:hover": {
                      background: "linear-gradient(45deg, #00b24a, #52c210)",
                      boxShadow: "0 8px 25px rgba(100, 221, 23, 0.4)",
                      transform: "translateY(-1px)",
                    },
                    "&:disabled": {
                      background: "rgba(255,255,255,0.12)",
                      color: "rgba(255,255,255,0.3)"
                    },
                    "&:active": {
                      transform: "translateY(1px)",
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : loginType === "admin" ? (
                    "Authenticate Admin"
                  ) : (
                    "Sign In"
                  )}
                </Button>

                {loginType === "user" && (
                  <Typography
                    align="center"
                    variant="body2"
                    sx={{
                      mt: 3,
                      color: "rgba(255, 255, 255, 0.6)",
                    }}
                  >
                    Don't have an account?{" "}
                    <Link
                      to="/signup"
                      style={{
                        color: "#64dd17",
                        fontWeight: 700,
                        textDecoration: "none",
                        marginLeft: "4px",
                      }}
                    >
                      Register Here
                    </Link>
                  </Typography>
                )}
              </Box>
            </Paper>
          </Container>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Login;