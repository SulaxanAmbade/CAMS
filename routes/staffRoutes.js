const express = require("express");
const router = express.Router();
const {
  getAllPatient,
  addNewPatient,
  getPatientById,
  updatePatient,
  deletePatient,
  getAllDoctors,
  deleteDoctor,
  addNewDoctor,
} = require("../controllers/staffController");

// Fetch all patients
router.get("/getAllPatient", getAllPatient);

// Add a new patient
router.post("/addNewPatient", addNewPatient);

// Get a patient by ID
router.get("/getPatientById/:id", getPatientById);

// Update a patient by ID
router.put("/updatePatient/:id", updatePatient);

// Delete a patient by ID
router.delete("/deletePatient/:id", deletePatient);

router.get("/getAllDoctors", getAllDoctors);

router.post("/addNewDoctor", addNewDoctor);

router.delete("deleteDoctor/:id",deleteDoctor)


module.exports = router;
