import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";

import Home from "./pages/Home";
import About from "./pages/WeAre";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Productandservicehome from "./pages/Productandservicehome";
import AdminDashboard from "./pages/AdminDashboard";
import AddProduct from "./pages/AddProduct";
import ProductDetails from "./pages/ProductDetails";
import CheckOut from "./pages/Checkout";
import OdersList from "./pages/OdersList" ;
import ShippingDetails from "./pages/ShippingDetails";
import ProcessOders from "./pages/ProcessOders";
import ShippingOrders from "./pages/PackedOrders";
import CustomerCare from "./pages/CustomerCare";
import DeliveredOrders from "./pages/ShippedOrders";
import ReturnedOrders from "./pages/ReturnedOrders";
import KHub from "./pages/KHub";
import UpdateProductInfo from "./pages/UpdateProductInfo";
import Smartfarming from "./pages/Smartfarming";

function App() {
  // Global cart tracking
  const [cart, setCart] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  const cartTotalPrice = cart.reduce((total, item) => total + Number(item.price) * item.quantity, 0);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/KHub" element={<KHub />} />

        
        {/* Marketplace Hub Route */}
        <Route 
          path="/Productandservicehome" 
          element={
            <Productandservicehome 
              cart={cart} 
              setCart={setCart} 
              cartTotalPrice={cartTotalPrice} 
              setSnackbar={setSnackbar} 
            />
          } 
        />
        
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/addproduct" element={<AddProduct />} />
        <Route path="/products" element={<ProductDetails />} />
        <Route path="/OdersList" element={<OdersList/>} />
        <Route path="/shipping-details" element={<ShippingDetails />} />
        <Route path="/ProcessOders" element={<ProcessOders />} />
        <Route path="/ShippingOrders" element={<ShippingOrders/>}/>
        <Route path="/CustomerCare" element={<CustomerCare/>}/>
        <Route path="/DeliveredOrders" element={<DeliveredOrders/>}/>
        <Route path="/ReturnedOrders" element={<ReturnedOrders/>}/>
        <Route path="/UpdateProductInfo" element={<UpdateProductInfo/>}/>
        <Route path="/Smartfarming" element={<Smartfarming/>}/>
        {/* Checkout Execution Route */}
        <Route 
          path="/checkOut" 
          element={
            <CheckOut 
              cart={cart} 
              setCart={setCart} 
              cartTotalPrice={cartTotalPrice} 
              setSnackbar={setSnackbar} 
            />
          } 
        />
      </Routes>

      {/* Global alert feedback channel */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="success" 
          variant="filled"
          sx={{ width: "100%", borderRadius: "10px", fontWeight: 600, background: "linear-gradient(45deg, #00c853, #64dd17)", color: "#091418" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default App;