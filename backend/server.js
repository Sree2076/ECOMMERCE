const express = require("express");
const cors = require("cors");
const Razorpay = require("razorpay");

const app = express();

app.use(cors());
app.use(express.json());

// Razorpay setup
const razorpay = new Razorpay({
  key_id: "rzp_test_xxxxxxxx", // replace with your key
  key_secret: "xxxxxxxxxx",     // replace with your secret
});

// Test route
app.get("/", (req, res) => {
  res.send("Backend running");
});

// Products API
app.get("/products", (req, res) => {
  res.json([
    { id: 1, name: "T-shirt", price: 499 },
    { id: 2, name: "Shoes", price: 999 },
    { id: 3, name: "Watch", price: 1999 },
  ]);
});

// Create order API
app.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ error: "Amount required" });
    }

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    res.json(order);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Error creating order" });
  }
});

// IMPORTANT for Render
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
