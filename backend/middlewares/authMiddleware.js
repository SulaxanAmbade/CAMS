const jwt = require("jsonwebtoken");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const Staff = require("../models/Staff");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let doctor = await Doctor.findById(decoded.id);
    if (doctor) {
      req.user = { id: doctor._id, role: "doctor" };
      return next();
    }

    let patient = await Patient.findById(decoded.id);
    if (patient) {
      req.user = {
        id: patient._id,
        contactNo: patient.contactNo,
        role: "patient",
      };
      return next();
    }

    let staff = await Staff.findById(decoded.id);
    if (staff) {
      req.user = { id: staff._id, role: "staff" };
      return next();
    }

    return res
      .status(404)
      .json({ success: false, message: "Authentication failed" });
  } catch (error) {
    console.error("❌ Auth Middleware Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Authorization error" });
  }
};
