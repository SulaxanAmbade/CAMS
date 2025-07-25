const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    role: { type: String, default: "patient" },
    contactNo: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    place: {
      type: String,
      required: true,
    },
    medicalHistory: {
      type: String,
      default: "Not Mentioned",
    },
    fcmToken: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Patient", PatientSchema);
