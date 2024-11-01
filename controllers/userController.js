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
      return res.status(200).send({ message: "User not found!", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(200).send({ message: "Invalid Credentials", success: false });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1hr" });
    // Check the role and fetch corresponding profile data
    let profileCompleted = false;
    // Assuming you have different models for each role
    if (user.role === "doctor") {
      const doctorProfile = await Doctor.findOne({ userId: user._id });
      profileCompleted = doctorProfile ? doctorProfile.isComplete : false; // Check if the doctor's profile is complete
    } else if (user.role === "staff") {
      const staffProfile = await Staff.findOne({ userId: user._id });
      profileCompleted = staffProfile ? staffProfile.isComplete : false; // Check if the staff's profile is complete
    } else if (user.role === "patient") {
      const patientProfile = await Patient.findOne({ userId: user._id });
      profileCompleted = patientProfile ? patientProfile.isComplete : false; // Check if the patient's profile is complete
    }
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
    const user = await User.findOne({ _id: req.body.userId });
    if (!user) {
      return res
        .status(200)
        .send({ message: "User Not Found!", success: failed });
    } else {
      res.status(200).send({
        success: true,
        data: {
          name: user.name,
          contactNo: user.contactNo,
          role:user.role
        },
      });
    }
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
module.exports = { registerUser, loginUser, authController ,completeProfile };