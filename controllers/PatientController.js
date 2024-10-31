const newPatient = require("../models/Patient"); // Keep the original naming
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

module.exports = {
  getAllPatient,
  addNewPatient,
  getPatientById,
  updatePatient,
  deletePatient,
};
