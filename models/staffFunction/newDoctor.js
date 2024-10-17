const mongoose = require("mongoose");

const newdoctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  contactNo: { type: String, required: true },
  email: { type: String, required: true },
});

const newDoctor = mongoose.model("newDoctor", newdoctorSchema);

module.exports = newDoctor;
