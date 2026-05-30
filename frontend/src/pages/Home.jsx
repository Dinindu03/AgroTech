import React from "react";

import axios from "axios";
import Navbar from "../components/Navbar";
import HeroPage from "../components/HeroPage";

import AboutUs from "../components/AboutUs";
import Footer from "../components/Footer";
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
} from "@mui/material";



const Home = () => {
  return (
    <Box>
      <Navbar />
      <HeroPage />
      <AboutUs />
      <Footer />
    </Box>
  );
};

export default Home;

