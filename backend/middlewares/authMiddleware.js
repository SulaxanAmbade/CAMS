const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const Staff = require("../models/Staff");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
      if (err) {
        return res.status(401).json({ success: false, message: "Invalid token" });
      }

      const user = await User.findById(decode.id);
      if (user) {
        req.user = { id: user._id, role: "user" };
        return next();
      }

      const doctor = await Doctor.findById(decode.id);
      if (doctor) {
        req.user = { id: doctor._id, role: "doctor" };
        return next();
      }

      const patient = await Patient.findById(decode.id);
      if (patient) {
        req.user = {
          id: patient._id,
          contactNo: patient.contactNo, // attach contact number
          role: "patient",
        };
        return next();
      }

      const staff = await Staff.findById(decode.id);
      if (staff) {
        req.user = { id: staff._id, role: "staff" };
        return next();
      }

      return res.status(404).json({ success: false, message: "Authentication failed" });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Authorization error" });
  }
};
