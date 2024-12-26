const Doctor = require("../models/Doctor");
const jwt = require("jsonwebtoken");
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    if (doctors.length === 0) {
      return res
        .status(201)
        .json({ success: true, message: "No doctors found" });
    }

    res.status(200).json({ success: true, data: doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addDoctor = async (req, res) => {
  try {
    const { contact } = req.body;

    // Check if a doctor with the same contact already exists
    const existingDoctor = await Doctor.findOne({ contact });
    if (existingDoctor) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Doctor with this contact already exists.",
        });
    }

    // If no existing doctor, proceed to add a new doctor
    const DoctorData = new Doctor(req.body);
    const savedDoctor = await DoctorData.save();
    res.status(201).json({ success: true, data: savedDoctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteDoctor = async (req, res) => {
  try {
    const deletedDoctors = await Doctor.findByIdAndDelete(req.params.id);
    if (!deletedDoctors) {
      return res
        .status(201)
        .json({ success: true, message: "Doctor not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Doctor deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const doctorLogin = async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res
      .status(400)
      .json({ success: false, message: "Phone number is required" });
  }

  try {
    // Check if a doctor exists with the given phone number
    const doctor = await Doctor.findOne({ contact: phoneNumber });

    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }
    const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET, {
      expiresIn: "1hr",
    });
    // Login successful
    return res.status(200).json({
      success: true,
      message: "Login successful",
      doctor: { ...doctor._doc },
      token,
    });
  } catch (err) {
    console.error("Error during login:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  getAllDoctors,
  addDoctor,
  deleteDoctor,
  doctorLogin,
};
