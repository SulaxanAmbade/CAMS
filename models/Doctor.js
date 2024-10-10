const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  specialty: {
    type: String,
    required: true,
  },
  contactNo: {
    type: String,
    required: true,
  },
  experience: {
    type: Number,
    required: true, // Number of years of experience
  },
  education: {
    type: String,
    required: true, // Educational qualifications
  },
}, { timestamps: true });

const Doctor = mongoose.model("Doctor", doctorSchema);
module.exports = Doctor;
