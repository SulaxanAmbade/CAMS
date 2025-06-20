const mongoose = require("mongoose");

const DoctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  specialization: { type: String, required: true },
  contact: String,
  visitingHours: {
    start: { type: String, required: true },
    end: { type: String, required: true },
    slot: { type: Number, required: true }, // Duration in minutes
  },
});

module.exports = mongoose.model("Doctor", DoctorSchema);
