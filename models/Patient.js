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
  },
  { timestamps: true }
);

const Patient = mongoose.model("Patients", PatientSchema);
module.exports = Patient;
