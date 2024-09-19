const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: [true, "Patient is required!"],
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: [true, "Doctor is required!"],
  },
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff",
    required: [true, "Staff is required!"],
  },
  timeSlot: {
    type: Date,
    required: [true, "Time Slot is required!"],
  },
  status: {
    type: String,
    enum: ["Scheduled", "Completed", "Cancelled"],
    default: "Scheduled",
    required: [true, "Status is required!"],
  },
});

const Appointment = mongoose.model("Appointment", appointmentSchema);
module.exports = Appointment;
