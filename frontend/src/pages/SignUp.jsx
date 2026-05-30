import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import BadgeIcon from "@mui/icons-material/Badge";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import Navbar from "../components/Navbar";

const SignUp = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    fullname: "",
    email: "",
    nic: "",
    password: "",
  });

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/add",
        formData
      );

      alert(res.data.message || "Account created successfully!");

      setFormData({
        name: "",
        fullname: "",
        email: "",
        nic: "",
        password: "",
      });

      // Redirect to Login Page
      navigate("/login");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to create account. Please try again."
      );
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1974&auto=format&fit=crop')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        py: 5,
      }}
    >
      <Navbar />

      <Container maxWidth="sm">
        <Paper
          elevation={10}
          sx={{
            mt: 5,
            p: 5,
            borderRadius: "25px",
            backdropFilter: "blur(12px)",
            background: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "#fff",
          }}
        >
          <Typography
            variant="h3"
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              mb: 1,
            }}
          >
            TechAgro
          </Typography>

          <Typography
            sx={{
              textAlign: "center",
              mb: 4,
              color: "rgba(255,255,255,0.8)",
            }}
          >
            Create Your Account
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            {/* Username */}
            <TextField
              fullWidth
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Username"
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: "#2e7d32" }} />
                  </InputAdornment>
                ),
              }}
              sx={inputStyle}
            />

            {/* Full Name */}
            <TextField
              fullWidth
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              placeholder="Full Name"
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: "#2e7d32" }} />
                  </InputAdornment>
                ),
              }}
              sx={inputStyle}
            />

            {/* Email */}
            <TextField
              fullWidth
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: "#2e7d32" }} />
                  </InputAdornment>
                ),
              }}
              sx={inputStyle}
            />

            {/* NIC */}
            <TextField
              fullWidth
              name="nic"
              value={formData.nic}
              onChange={handleChange}
              placeholder="NIC Number"
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BadgeIcon sx={{ color: "#2e7d32" }} />
                  </InputAdornment>
                ),
              }}
              sx={inputStyle}
            />

            {/* Password */}
            <TextField
              fullWidth
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: "#2e7d32" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={inputStyle}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{
                mt: 4,
                py: 1.8,
                borderRadius: "14px",
                fontSize: "16px",
                fontWeight: "bold",
                backgroundColor: "#2e7d32",
                "&:hover": {
                  backgroundColor: "#1b5e20",
                },
              }}
            >
              Create Account
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

const inputStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "14px",
    background: "rgba(255,255,255,0.95)",
  },
};

export default SignUp;