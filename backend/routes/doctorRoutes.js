const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');

// Route to create a new doctor
router.post('/', doctorController.createDoctor);

// Route to get all doctors
router.get('/', doctorController.getDoctors);

// Route to get a single doctor by ID
router.get('/:id', doctorController.getDoctorById);

// Route to update a doctor
router.put('/:id', doctorController.updateDoctor);

// Route to delete a doctor
router.delete('/:id', doctorController.deleteDoctor);

module.exports = router;
