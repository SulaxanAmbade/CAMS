const newPatient = require("../models/Patient");
const jwt = require("jsonwebtoken");

const getAllPatient = async (req, res) => {
  try {
    const patients = await newPatient.find();
    if (patients.length === 0) {
      return res
        .status(201)
        .json({ success: true, message: "No patients found" });
    }
    res.status(200).json({ success: true, data: patients });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addNewPatient = async (req, res) => {
  try {
    const { contactNo } = req.body;
    const existingPatient = await newPatient.findOne({ contactNo });
    if (existingPatient) {
      return res.status(400).json({
        success: false,
        message: "Patient with this contact already exists.",
      });
    }

    const newPatientData = new newPatient(req.body);
    const savedPatient = await newPatientData.save();
    res.status(201).json({ success: true, data: savedPatient });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getPatientById = async (req, res) => {
  try {
    const patient = await newPatient.findById(req.params.id);
    if (!patient) {
      return res
        .status(404)
        .json({ success: false, message: "Patient not found" });
    }
    res.status(200).json({ success: true, data: patient });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updatePatient = async (req, res) => {
  try {
    const updatedPatient = await newPatient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedPatient) {
      return res
        .status(404)
        .json({ success: false, message: "Patient not found" });
    }
    res.status(200).json({ success: true, data: updatedPatient });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deletePatient = async (req, res) => {
  try {
    const deletedPatient = await newPatient.findByIdAndDelete(req.params.id);
    if (!deletedPatient) {
      return res
        .status(404)
        .json({ success: false, message: "Patient not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Patient deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const patientLogin = async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res
      .status(400)
      .json({ success: false, message: "Phone number is required" });
  }

  try {
    const patient = await newPatient.findOne({ contactNo: phoneNumber });

    if (!patient) {
      return res
        .status(404)
        .json({ success: false, message: "Patient not found" });
    }

    const token = jwt.sign(
      { id: patient._id, contactNo: patient.contactNo, role: "patient" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      patient: { ...patient._doc },
      token,
    });
  } catch (err) {
    console.error("Error during login:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const saveFcmToken = async (req, res) => {
  try {
    console.log("🔐 Incoming FCM token request");
    console.log("➡️ req.user:", req.user);
    console.log("➡️ req.body:", req.body);

    const { token } = req.body;
    const contactNo = req.user.contactNo;

    if (!token) {
      console.warn("⚠️ Token missing");
      return res.status(400).json({
        success: false,
        message: "Token  missing",
      });
    }
    if (!contactNo) {
      console.warn("⚠️ contactNo missing");
      return res.status(400).json({
        success: false,
        message: " contact number missing",
      });
    }

    const updatedPatient = await newPatient.findOneAndUpdate(
      { contactNo },
      { $set: { fcmToken: token } },
      { new: true }
    );

    if (!updatedPatient) {
      console.warn("⚠️ Patient not found");
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    console.log("✅ Token saved successfully for:", contactNo);

    return res.status(200).json({
      success: true,
      message: "✅ FCM token saved successfully",
    });
  } catch (error) {
    console.error("❌ FCM Token Save Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message, // Optional: expose error in dev
    });
  }
};

const getUserData = async (req, res) => {
  try {
    const patient = await newPatient.findById(req.user.id);
    if (!patient) {
      return res
        .status(404)
        .json({ success: false, message: "Patient not found" });
    }
    res.status(200).json({ success: true, data: patient });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllPatient,
  addNewPatient,
  getPatientById,
  updatePatient,
  deletePatient,
  patientLogin,
  saveFcmToken,
  getUserData,
};
