const express = require("express");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const loginRoutes = require("./routes/loginRoutes");
const productRoutes = require("./routes/productRoutes");
const adminRoutes = require("./routes/adminRoutes");
const orderRoutes=require("./routes/orderRoutes");
const shippingDetailsRoutes=require("./routes/shipping-detailsRoute");
const dashboard =require("./routes/dashboardRoutes");
const contactRoutes = require("./routes/contact");
const updateProductRoute = require("./routes/updateproductRoute");



const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/shipping", shippingDetailsRoutes);
app.use("/api/dashboard", dashboard);
app.use("/api/contact", contactRoutes);
app.use("/api/updateproducts", updateProductRoute);



// Test Route
app.get("/", (req, res) => {
  res.send("AgroTech Backend Running");
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});