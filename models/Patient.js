const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  contactNo: {
    type: String,
    required: true,
  },
  emergencyContact: {
    type: String,
    required: true,
  },
  medicalHistory: {
    type: String,
    default: "",
  },
}, { timestamps: true });

const Patient = mongoose.model("Patient", patientSchema);
module.exports = Patient;
