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
  CircularProgress,
  Grid,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

import Navbar from "../components/Navbar";
import ProductAndService from "../assets/hero.jpg";

function SignUp() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [formData, setFormData] = useState({
    role: "user",
    name: "",
    fullname: "",
    email: "",
    nic: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/users/register",
        {
          role: formData.role,
          name: formData.name,
          fullname: formData.fullname,
          email: formData.email,
          nic: formData.nic,
          password: formData.password,
        }
      );

      alert(
        res.data.message ||
          "Account created successfully"
      );

      navigate("/login");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: `
          linear-gradient(
            rgba(0,0,0,0.55),
            rgba(0,0,0,0.55)
          ),
          url(${ProductAndService})
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Navbar />

      <Container
        maxWidth="sm"
        sx={{
          py: 5,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={20}
          sx={{
            width: "100%",
            p: 5,
            borderRadius: "30px",
            background:
              "rgba(255,255,255,0.08)",
            backdropFilter: "blur(20px)",
            border:
              "1px solid rgba(255,255,255,0.15)",
            boxShadow:
              "0 20px 50px rgba(0,0,0,0.35)",
          }}
        >
          <Typography
            variant="h3"
            align="center"
            sx={{
              fontWeight: 800,
              color: "#fff",
              mb: 1,
            }}
          >
           AgroTech
          </Typography>

          <Typography
            align="center"
            sx={{
              color:
                "rgba(255,255,255,0.8)",
              mb: 4,
            }}
          >
            Create Your Account
          </Typography>

          {/* Role Selection */}
          
           
             
                

            <Grid item xs={6}>
              <Paper
                onClick={() =>
                  setFormData({
                    ...formData,
                    role: "User",
                  })
                }
                sx={{
                  p: 2,
                  textAlign: "center",
                  cursor: "pointer",
                  borderRadius: 3,
                  color: "#fff",
                  background:
                    formData.role === "User"
                      ? "linear-gradient(135deg,#1976d2,#0D47A1)"
                      : "rgba(255,255,255,0.1)",
                  border:
                    formData.role === "User"
                      ? "2px solid #fff"
                      : "1px solid rgba(255,255,255,0.2)",
                  transition: "0.3s",
                }}
              >
                <AdminPanelSettingsIcon
                  sx={{
                    fontSize: 40,
                    mb: 1,
                  }}
                />
                <Typography fontWeight="bold">
                  User Registration
                </Typography>
              </Paper>
            </Grid>
          

          <Box
            component="form"
            onSubmit={handleSubmit}
          >
            <TextField
  fullWidth
  required
  placeholder="Enter Username"
  name="name"
  value={formData.name}
  onChange={handleChange}
  margin="normal"
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <PersonIcon color="success" />
      </InputAdornment>
    ),
  }}
  sx={inputStyle}
/>
            <TextField
              fullWidth
              required
              placeholder="Enter Full Name"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="success" />
                  </InputAdornment>
                ),
              }}
              sx={inputStyle}
            />

            <TextField
              fullWidth
              required
              placeholder ="Email Address"
              type="email"
              name="email"
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
              placeholder="NIC Number"
              name="nic"
              value={formData.nic}
              onChange={handleChange}
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AssignmentIndIcon color="success" />
                  </InputAdornment>
                ),
              }}
              sx={inputStyle}
            />

            <TextField
              fullWidth
              required
              placeholder="Password"
              name="password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
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
                        setShowPassword(
                          !showPassword
                        )
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

            <TextField
              fullWidth
              required
              placeholder="Confirm Password"
              name="confirmPassword"
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              value={
                formData.confirmPassword
              }
              onChange={handleChange}
              margin="normal"
              sx={inputStyle}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                mt: 4,
                py: 1.7,
                borderRadius: 3,
                fontWeight: 700,
                fontSize: "1rem",
                background:
                  formData.role === "admin"
                    ? "linear-gradient(135deg,#1976D2,#0D47A1)"
                    : "linear-gradient(135deg,#4CAF50,#2E7D32)",
              }}
            >
              {loading ? (
                <CircularProgress
                  size={24}
                  color="inherit"
                />
              ) : (
                `Create ${formData.role} Account`
              )}
            </Button>

            <Typography
              align="center"
              sx={{
                mt: 3,
                color: "#fff",
              }}
            >
              Already have an account?{" "}
              <Link
                to="/login"
                style={{
                  color: "#81C784",
                  textDecoration: "none",
                  fontWeight: "bold",
                }}
              >
                Login Here
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
    backgroundColor:
      "rgba(255,255,255,0.95)",
    borderRadius: "15px",

    "&.Mui-focused": {
      boxShadow:
        "0 0 0 4px rgba(76,175,80,0.2)",
    },
  },
};

export default SignUp;