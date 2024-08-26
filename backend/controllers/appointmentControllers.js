const { Appointment, Patient, Doctor, Staff } = require('../models');

// Create a new appointment
exports.createAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.create(req.body);
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create appointment' });
  }
};

// Get all appointments
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      include: [Patient, Doctor, Staff]
    });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
};

// Get a single appointment by ID
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [Patient, Doctor, Staff]
    });
    if (appointment) {
      res.status(200).json(appointment);
    } else {
      res.status(404).json({ error: 'Appointment not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch appointment' });
  }
};

// Update an appointment
exports.updateAppointment = async (req, res) => {
  try {
    const [updated] = await Appointment.update(req.body, {
      where: { AppointmentId: req.params.id }
    });
    if (updated) {
      const updatedAppointment = await Appointment.findByPk(req.params.id);
      res.status(200).json(updatedAppointment);
    } else {
      res.status(404).json({ error: 'Appointment not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update appointment' });
  }
};

// Delete an appointment
exports.deleteAppointment = async (req, res) => {
  try {
    const deleted = await Appointment.destroy({
      where: { AppointmentId: req.params.id }
    });
    if (deleted) {
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Appointment not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete appointment' });
  }
};
