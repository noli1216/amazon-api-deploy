const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Make sure this comes AFTER dotenv.config()
const stripe = require("stripe")(process.env.STRIPE_KEY);

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Success from Amazon API server!",
  });
});

app.post("/payment/create", async (req, res) => {
  const total = req.query.total;

  if (total > 0) {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: "usd",
    });

    res.status(201).json({
      clientSecret: paymentIntent.client_secret,
    });
  } else {
    res.status(403).json({
      message: "Total must be greater than 0",
    });
  }
});

app.listen(5000, () => {
  console.log("✅ Amazon Server Running at http://localhost:5000");
});
