const newPatient = require("../models/Patient");
const jwt = require("jsonwebtoken");

const getAllPatient = async (req, res) => {
  try {
    const patients = await newPatient.find();
    if (patients.length === 0) {
      return res.status(201).json({ success: true, message: "No patients found" });
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
      return res.status(404).json({ success: false, message: "Patient not found" });
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
      return res.status(404).json({ success: false, message: "Patient not found" });
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
      return res.status(404).json({ success: false, message: "Patient not found" });
    }
    res.status(200).json({ success: true, message: "Patient deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const patientLogin = async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ success: false, message: "Phone number is required" });
  }

  try {
    const patient = await newPatient.findOne({ contactNo: phoneNumber });

    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }

    const token = jwt.sign(
      { id: patient._id, contactNo: patient.contactNo },
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
    const { token } = req.body;
    const contactNo = req.user.contactNo;

    if (!token || !contactNo) {
      return res
        .status(400)
        .json({ success: false, message: "Token or contact number missing" });
    }

    const updatedPatient = await newPatient.findOneAndUpdate(
      { contactNo },
      { fcmToken: token },
      { new: true }
    );

    if (!updatedPatient) {
      return res
        .status(404)
        .json({ success: false, message: "Patient not found" });
    }

    res.status(200).json({
      success: true,
      message: "✅ FCM token saved successfully",
    });
  } catch (error) {
    console.error("FCM Token Save Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
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
};
