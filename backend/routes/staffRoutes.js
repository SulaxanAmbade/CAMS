const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');

// Route to create a new staff member
router.post('/', staffController.createStaff);

// Route to get all staff members
router.get('/', staffController.getStaff);

// Route to get a single staff member by ID
router.get('/:id', staffController.getStaffById);

// Route to update a staff member
router.put('/:id', staffController.updateStaff);

// Route to delete a staff member
router.delete('/:id', staffController.deleteStaff);

module.exports = router;
