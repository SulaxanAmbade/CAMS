// models/Appointment.js
const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Cancelled", "Completed", "No-Show"],
    default: "Pending",
    required: true,
  },
});

module.exports = mongoose.model("Appointment", appointmentSchema);
