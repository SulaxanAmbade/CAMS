const mongoose = require("mongoose");

const newpatientSchema = new mongoose.Schema(
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

const newPatient = mongoose.model("newPatients", newpatientSchema);
module.exports = newPatient;
