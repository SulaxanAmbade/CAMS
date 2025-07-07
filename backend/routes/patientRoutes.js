const express = require("express");
const router = express.Router();
const {
  getAllPatient,
  addNewPatient,
  getPatientById,
  updatePatient,
  deletePatient,
  patientLogin,
  saveFcmToken,
  getUserData,
} = require("../controllers/PatientController");
const authMiddleware = require("../middlewares/authMiddleware");
router.get("/getAllPatient", getAllPatient);

// Add a new patient
router.post("/addNewPatient", addNewPatient);

// Get a patient by ID
router.get("/getPatientById/:id", getPatientById);

// Update a patient by ID
router.put("/updatePatient/:id", updatePatient);

// Delete a patient by ID
router.delete("/deletePatient/:id", deletePatient);

router.post("/login", patientLogin);

router.post("/save-token", authMiddleware, saveFcmToken);
router.post("/getUserData", authMiddleware, getUserData);
module.exports = router;
