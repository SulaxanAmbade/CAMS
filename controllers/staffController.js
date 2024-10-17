const newDoctor = require("../models/staffFunction/newDoctor");
const newPatient = require("../models/staffFunction/newPatient"); // Keep the original naming

// Get all patients
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

const getAllDoctors = async (req, res) => {
  try {
    const doctors = await newDoctor.find(); // Use find() to fetch all patients

    // Check if the patients array is empty
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

const addNewDoctor = async (req, res) => {
  try {
    const newDoctorData = new newDoctor(req.body); // Create a new patient instance
    const savedDoctor = await newDoctorData.save(); // Save to the database
    res.status(201).json({ success: true, data: savedDoctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteDoctor = async (req, res) => {
  try {
    const deletedDoctors = await newDoctor.findByIdAndDelete(req.params.id); // Delete patient by ID
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

module.exports = {
  getAllPatient,
  addNewPatient,
  getPatientById,
  updatePatient,
  deletePatient,
  getAllDoctors,
  addNewDoctor,
  deleteDoctor,
};
