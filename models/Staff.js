const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  position: {
    type: String,
    required: true, // Position of the staff member (e.g., Receptionist, Administrator)
  },
  department: {
    type: String,
    required: true, // Department where the staff works (e.g., Administration, Billing)
  },
  contactNo: {
    type: String,
    required: true, // Contact number for the staff member
  },
  joiningDate: {
    type: Date,
    required: true, // Date when the staff member joined
  },
  workExperience: {
    type: Number,
    required: true, // Years of work experience
  },
}, { timestamps: true });

const Staff = mongoose.model("Staff", staffSchema);
module.exports = Staff;
