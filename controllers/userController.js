const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Staff = require('../models/Staff');

// Register a new user based on role
exports.registerUser = async (req, res) => {
    const { fName, lName, phNo, pass, role } = req.body;

    try {
        let user;
        const commonData = {
            name: `${fName} ${lName}`,
            contactNo: phNo,
            password: pass,
        };

        switch (role) {
            case 'Doctor':
                user = new Doctor(commonData);
                break;
            case 'Patient':
                user = new Patient(commonData);
                break;
            case 'Staff':
                user = new Staff(commonData);
                break;
            default:
                return res.status(400).json({ message: 'Invalid role selected' });
        }

        await user.save();
        res.status(201).json({ success: true, message: `${role} registered successfully`, user });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
