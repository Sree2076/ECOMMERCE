const express = require("express");
const cors = require("cors");
const Razorpay = require("razorpay");

const app = express();

app.use(cors());
app.use(express.json());
app.get("/check", (req, res) => {
  res.send("CHECK OK");
});

// 🔑 Razorpay setup (TEST KEYS)
const razorpay = new Razorpay({
  key_id: "rzp_test_SYyAVnudZLkLpN",
  key_secret: "AP4dPC6zmkEDBKpb0Tyi97mW",
});

// 🛍️ Products API
app.get("/products", (req, res) => {
  res.json([
    { id: 1, name: "T-shirt", price: 499 },
    { id: 2, name: "Shoes", price: 999 },
    { id: 3, name: "Watch", price: 1999 },
  ]);
});

// 💳 Create order API
app.post("/create-order", async (req, res) => {
  const { amount } = req.body;

  const options = {
    amount: amount * 100, // convert to paise
    currency: "INR",
    receipt: "receipt_order_1",
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating order");
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});