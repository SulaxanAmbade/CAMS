const mongoose = require("mongoose");

const DoctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  specialization: { type: String, required: true },
  role: { type: String, default: "doctor" },
  contactNo: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Doctor", DoctorSchema);
