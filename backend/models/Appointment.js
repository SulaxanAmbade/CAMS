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
  slotTime: {
    type: String,
    required: true, // e.g., "09:00–10:00"
  },
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Cancelled", "Completed"],
    default: "Pending",
    required: true,
  },
  remarks: { type: String, required: false },
  remindersSent: {
    type: [Number],
    default: [],
  },
});

module.exports = mongoose.model("Appointment", appointmentSchema);
