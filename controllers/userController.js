const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Staff = require('../models/Staff');

// Register a new user based on role
const registerUser = async (req, res) => {
    const { fName, lName, phNo, pass, role } = req.body;

    try {
        let user;
        const hashedPassword = await bcrypt.hash(pass, 10); // Hash the password before saving
        const commonData = {
            name: `${fName} ${lName}`,
            contactNo: phNo,
            password: hashedPassword,
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

// Login a user based on phone number and password
const loginUser = async (req, res) => {
    const { phNo, pass, role } = req.body;

    try {
        let user;

        // Find the user by phone number based on the role
        switch (role) {
            case 'Doctor':
                user = await Doctor.findOne({ contactNo: phNo });
                break;
            case 'Patient':
                user = await Patient.findOne({ contactNo: phNo });
                break;
            case 'Staff':
                user = await Staff.findOne({ contactNo: phNo });
                break;
            default:
                return res.status(400).json({ message: 'Invalid role selected' });
        }

        // Check if the user with the given phone number exists
        if (!user) {
            return res.status(404).json({ message: 'User not found with the provided phone number' });
        }

        // Compare the password with the stored hashed password
        const isMatch = await bcrypt.compare(pass, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Create and send the JWT token on successful login
        const token = jwt.sign(
            { id: user._id, role: role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ success: true, message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// const getUser = async (req,res)=>{
//     try {
//         const 
//     } catch (error) {
        
//     }
// }

module.exports = { registerUser, loginUser };
