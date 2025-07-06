const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  contactNo: {
    type: String,
    required: true,
  }, // Contact number for the staff member
  password: {
    type: String,
    required: true,
  },
  role: { type: String, default: "staff" },
});

const Staff = mongoose.model("Staff", staffSchema);
module.exports = Staff;
