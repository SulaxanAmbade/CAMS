const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Staff = require("../models/Staff");
const registerUser = async (req, res) => {
  try {
    const existingUser = await User.findOne({ contactNo: req.body.contactNo });
    if (existingUser) {
      return res
        .status(200)
        .send({ message: "User Already Exist", success: false });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json({
      success: true,
      message: "Registered Succesfully !!",
      newUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ contactNo: req.body.contactNo });
    if (!user) {
      return res
        .status(200)
        .send({ message: "User not found!", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Invalid Credentials", success: false });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1hr",
    });
    // Check the role and fetch corresponding profile data
    let profileCompleted = false;
    // Assuming you have different models for each role

    res.status(200).send({
      message: "Logged In Successfully",
      success: true,
      token,
      user: {
        ...user._doc,
        profileCompleted,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const authController = async (req, res) => {
  try {
    // First, check if the user exists
    const user = await User.findOne({ _id: req.body.userId });
    if (user) {
      return res.status(200).send({
        success: true,
        data: {
          ID: user._id,
          name: user.name,
          contactNo: user.contactNo,
          role: user.role,
        },
      });
    }

    // If not a user, check if it's a doctor
    const doctor = await Doctor.findOne({ _id: req.body.userId });
    if (doctor) {
      return res.status(200).send({
        success: true,
        data: {
          ID: doctor._id,
          name: doctor.name,
          contactNo: doctor.contact,
          specialization: doctor.specialization,
          role: "Doctor",
        },
      });
    }
    const patient = await Patient.findOne({ _id: req.body.userId });
    if (patient) {
      return res.status(200).send({
        success: true,
        data: {
          ID: patient._id,
          name: patient.name,
          contactNo: patient.contactNo,
          dateOfBirth: patient.dateOfBirth,
          gender: patient.gender,
          medicalHistory: patient.medicalHistory,
          role: "Patient",
        },
      });
    }
    const staff = await Staff.findOne({ _id: req.body.userId });
    if (staff) {
      return res.status(200).send({
        success: true,
        data: {
          ID: staff._id,
          name: staff.name,
          contactNo: staff.contactNo,
          role: "Staff",
        },
      });
    }

    // If neither user nor doctor is found
    return res
      .status(404)
      .send({ message: "User or Doctor Not Found!", success: false });
  } catch (error) {
    res.status(500).json({ success: false, message: "Authentication Failed" });
  }
};

const completeProfile = async (req, res) => {
  try {
    const { role, userId } = req.body; // Get role and userId from request
    let profileData;
    if (role === "Patient") {
      profileData = new Patient({ ...req.body, userId });
    } else if (role === "Doctor") {
      profileData = new Doctor({ ...req.body, userId });
    } else if (role === "Staff") {
      profileData = new Staff({ ...req.body, userId });
    } else {
      return res.status(400).send({ success: false, message: "Invalid role" });
    }
    await profileData.save(); // Save the specific profile data
    res.status(201).send({ success: true, message: "Profile completed" });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};
module.exports = { registerUser, loginUser, authController, completeProfile };
