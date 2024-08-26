const { Patient } = require('../models');

// Create a new patient
exports.createPatient = async (req, res) => {
  try {
    const patient = await Patient.create(req.body);
    res.status(201).json(patient);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create patient' });
  }
};

// Get all patients
exports.getPatients = async (req, res) => {
  try {
    const patients = await Patient.findAll();
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
};

// Get a single patient by ID
exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.id);
    if (patient) {
      res.status(200).json(patient);
    } else {
      res.status(404).json({ error: 'Patient not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch patient' });
  }
};

// Update a patient
exports.updatePatient = async (req, res) => {
  try {
    const [updated] = await Patient.update(req.body, {
      where: { PatientId: req.params.id }
    });
    if (updated) {
      const updatedPatient = await Patient.findByPk(req.params.id);
      res.status(200).json(updatedPatient);
    } else {
      res.status(404).json({ error: 'Patient not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update patient' });
  }
};

// Delete a patient
exports.deletePatient = async (req, res) => {
  try {
    const deleted = await Patient.destroy({
      where: { PatientId: req.params.id }
    });
    if (deleted) {
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Patient not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete patient' });
  }
};
