const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

// Route to create a new appointment
router.post('/', appointmentController.createAppointment);

// Route to get all appointments
router.get('/', appointmentController.getAppointments);

// Route to get a single appointment by ID
router.get('/:id', appointmentController.getAppointmentById);

// Route to update an appointment
router.put('/:id', appointmentController.updateAppointment);

// Route to delete an appointment
router.delete('/:id', appointmentController.deleteAppointment);

module.exports = router;
