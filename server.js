const express = require("express");
const colors = require("colors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// dotenv config
dotenv.config();

// MongoDB connection
connectDB();

// Initialize express
const app = express();

// Middleware
app.use(express.json());
app.use(morgan("dev"));

// API routes
app.use("/api/v1/user", require("./routes/userRoutes"));

// Health Check route
app.get("/", (req, res) => {
  res.status(200).send({
    message: "Server is Running!",
  });
});

// Listen to port
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(
    `Server is Running in ${process.env.NODE_ENV} mode on port ${port}`.blue
  );
});
