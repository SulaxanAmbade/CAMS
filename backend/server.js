const express = require("express");
const colors = require("colors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");
// dotenv config
dotenv.config();

// MongoDB connection
connectDB();
// Appointment reminder scheduler
require("./schedulers/reminderScheduler");

// Initialize express
const app = express();
const port = process.env.PORT || 3001;
app.use(
  cors({
    origin: "https://cams-hx0j.onrender.com",
  })
);
// Middleware
app.use(express.json());
app.use(morgan("dev"));

// API routes
app.use("/api/v1/user", require("./routes/userRoutes"));
app.use("/api/v1/patient", require("./routes/patientRoutes.js"));
app.use("/api/v1/doctor", require("./routes/doctorRoutes.js"));
app.use("/api/v1/staff", require("./routes/staffRoutes.js"));
app.use("/api/v1/auth", require("./routes/authRoutes.js"));
app.use("/api/v1/appointment", require("./routes/appointmentRoutes.js"));
// Health Check route
app.get("/", (req, res) => {
  res.status(200).send({
    message: "Server is Running!",
  });
});

// Listen to port
app.listen(port, () => {
  console.log(
    `Server is Running in ${process.env.NODE_ENV} mode on port ${port}`.blue
  );
});
