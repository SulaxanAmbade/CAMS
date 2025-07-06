const Doctor = require("../models/Doctor");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
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
    const { contact, password, ...rest } = req.body;

    // Input validation
    if (!contact || !password) {
      return res.status(400).json({
        success: false,
        message: "Contact and password are required.",
      });
    }

    // Check if a doctor with the same contact already exists
    const existingDoctor = await Doctor.findOne({ contact });
    if (existingDoctor) {
      return res.status(400).json({
        success: false,
        message: "Doctor with this contact already exists.",
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new doctor with hashed password
    const newDoctor = new Doctor({
      contact,
      password: hashedPassword,
      ...rest,
    });

    // Save to database
    const savedDoctor = await newDoctor.save();

    return res.status(201).json({
      success: true,
      data: savedDoctor,
    });
  } catch (error) {
    console.error("Error adding doctor:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. " + error.message,
    });
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
    const isMatch = await bcrypt.compare(req.body.password, doctor.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Invalid Credentials", success: false });
    }

    const token = jwt.sign(
      { id: doctor._id, role: "doctor" },
      process.env.JWT_SECRET,
      {
        expiresIn: "1yr",
      }
    );
    // Login successful
    return res.status(200).json({
      success: true,
      message: "Login successful",
      doctor: { ...doctor._doc },
      token,
    });
  } catch (err) {
    console.error("Error during login:", err);
    return res
      .status(500)
      .json({ success: false, message: "Something Went Wrong" });
  }
};
const getUserData = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.user.id);
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }
    res.status(200).json({ success: true, data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllDoctors,
  addDoctor,
  deleteDoctor,
  doctorLogin,
  getUserData,
};
