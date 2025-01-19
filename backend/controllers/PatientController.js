const newPatient = require("../models/Patient"); // Keep the original naming
const jwt = require("jsonwebtoken");
const getAllPatient = async (req, res) => {
  try {
    const patients = await newPatient.find(); // Use find() to fetch all patients

    // Check if the patients array is empty
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

// Add a new patient
const addNewPatient = async (req, res) => {
  try {
    const { contactNo } = req.body;

    // Check if a doctor with the same contact already exists
    const existingPatient = await newPatient.findOne({ contactNo });
    if (existingPatient) {
      return res.status(400).json({
        success: false,
        message: "Patient with this contact already exists.",
      });
    }
    const newPatientData = new newPatient(req.body); // Create a new patient instance
    const savedPatient = await newPatientData.save(); // Save to the database
    res.status(201).json({ success: true, data: savedPatient });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a patient by ID
const getPatientById = async (req, res) => {
  try {
    const patient = await newPatient.findById(req.params.id); // Find patient by ID
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

// Update a patient by ID
const updatePatient = async (req, res) => {
  try {
    const updatedPatient = await newPatient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ); // Update patient data
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

// Delete a patient by ID
const deletePatient = async (req, res) => {
  try {
    const deletedPatient = await newPatient.findByIdAndDelete(req.params.id); // Delete patient by ID
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
    // Check if a patient exists with the given phone number
    const patient = await newPatient.findOne({ contactNo: phoneNumber });

    if (!patient) {
      return res
        .status(404)
        .json({ success: false, message: "patient not found" });
    }
    const token = jwt.sign({ id: patient._id }, process.env.JWT_SECRET, {
      expiresIn: "1hr",
    });
    // Login successful
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

module.exports = {
  getAllPatient,
  addNewPatient,
  getPatientById,
  updatePatient,
  deletePatient,
  patientLogin,
};
