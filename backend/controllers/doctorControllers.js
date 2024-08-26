const { Doctor } = require('../models');

// Create a new doctor
exports.createDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.create(req.body);
    res.status(201).json(doctor);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create doctor' });
  }
};

// Get all doctors
exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.findAll();
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
};

// Get a single doctor by ID
exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id);
    if (doctor) {
      res.status(200).json(doctor);
    } else {
      res.status(404).json({ error: 'Doctor not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch doctor' });
  }
};

// Update a doctor
exports.updateDoctor = async (req, res) => {
  try {
    const [updated] = await Doctor.update(req.body, {
      where: { DoctorId: req.params.id }
    });
    if (updated) {
      const updatedDoctor = await Doctor.findByPk(req.params.id);
      res.status(200).json(updatedDoctor);
    } else {
      res.status(404).json({ error: 'Doctor not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update doctor' });
  }
};

// Delete a doctor
exports.deleteDoctor = async (req, res) => {
  try {
    const deleted = await Doctor.destroy({
      where: { DoctorId: req.params.id }
    });
    if (deleted) {
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Doctor not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete doctor' });
  }
};
