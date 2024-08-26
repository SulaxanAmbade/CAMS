const { Staff } = require('../models');

// Create a new staff member
exports.createStaff = async (req, res) => {
  try {
    const staff = await Staff.create(req.body);
    res.status(201).json(staff);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create staff member' });
  }
};

// Get all staff members
exports.getStaff = async (req, res) => {
  try {
    const staff = await Staff.findAll();
    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch staff members' });
  }
};

// Get a single staff member by ID
exports.getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findByPk(req.params.id);
    if (staff) {
      res.status(200).json(staff);
    } else {
      res.status(404).json({ error: 'Staff member not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch staff member' });
  }
};

// Update a staff member
exports.updateStaff = async (req, res) => {
  try {
    const [updated] = await Staff.update(req.body, {
      where: { StaffId: req.params.id }
    });
    if (updated) {
      const updatedStaff = await Staff.findByPk(req.params.id);
      res.status(200).json(updatedStaff);
    } else {
      res.status(404).json({ error: 'Staff member not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update staff member' });
  }
};

// Delete a staff member
exports.deleteStaff = async (req, res) => {
  try {
    const deleted = await Staff.destroy({
      where: { StaffId: req.params.id }
    });
    if (deleted) {
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Staff member not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete staff member' });
  }
};
