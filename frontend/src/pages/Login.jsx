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
} from "@mui/material";

import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import Navbar from "../components/Navbar";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

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

    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/login",
        formData
      );

      if (res.data.success) {
        localStorage.setItem(
          "user",
          JSON.stringify(res.data.user)
        );

        alert("Login Successful");
        navigate("/");
      }
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Invalid Email or Password"
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
      }}
    >
      <Navbar />

      <Container
        maxWidth="sm"
        sx={{
          minHeight: "90vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={10}
          sx={{
            width: "100%",
            p: 5,
            borderRadius: 4,
            background: "rgba(255,255,255,0.12)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <Typography
            variant="h4"
            align="center"
            sx={{
              color: "#fff",
              fontWeight: "bold",
              mb: 1,
            }}
          >
            TechAgro
          </Typography>

          <Typography
            align="center"
            sx={{
              color: "rgba(255,255,255,0.8)",
              mb: 4,
            }}
          >
            Smart Agriculture Management System
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              required
              name="email"
              type="email"
              label="Email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="success" />
                  </InputAdornment>
                ),
              }}
              sx={inputStyle}
            />

            <TextField
              fullWidth
              required
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="success" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
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
                mt: 3,
                py: 1.5,
                fontWeight: "bold",
                borderRadius: 3,
                backgroundColor: "#2e7d32",
                "&:hover": {
                  backgroundColor: "#1b5e20",
                },
              }}
            >
              Login
            </Button>

            <Typography
              align="center"
              sx={{
                mt: 3,
                color: "#fff",
              }}
            >
              Don't have an account?{" "}
              <Link
                to="/signup"
                style={{
                  color: "#a5d6a7",
                  fontWeight: "bold",
                  textDecoration: "none",
                }}
              >
                Register
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

const inputStyle = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#fff",
    borderRadius: 3,
  },
};

export default Login;