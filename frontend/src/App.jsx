import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/WeAre";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Productandservicehome from "./pages/Productandservicehome";
import AdminDashboard from "./pages/AdminDashboard";
import AddProduct from "./pages/AddProduct";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/SignUp" element={<SignUp />} />
      <Route path="/Productandservicehome" element={<Productandservicehome />} />
      
       <Route path="/admindashboard" element={<AdminDashboard />} />
       <Route path="/addproduct" element={<AddProduct />} />
      
    </Routes>
  );
}

export default App;