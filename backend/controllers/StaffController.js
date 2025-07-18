const Staff = require("../models/Staff");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.find(); // Use find() to fetch all staff

    // Check if the staff array is empty
    if (staff.length === 0) {
      return res.status(201).json({ success: true, message: "No staff found" });
    }

    res.status(200).json({ success: true, data: staff });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const loginStaff = async (req, res) => {
  try {
    const staff = await Staff.findOne({ contactNo: req.body.contactNo });
    if (!staff) {
      return res
        .status(200)
        .send({ message: "Staff not found!", success: false });
    }

    // Log the password for debugging
    console.log("Database Password:", staff.password);
    console.log("Request Password:", req.body.password);

    const isMatch = await bcrypt.compare(req.body.password, staff.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Invalid Credentials", success: false });
    }

    const token = jwt.sign(
      { id: staff._id, role: "staff" },
      process.env.JWT_SECRET,
      {
        expiresIn: "1hr",
      }
    );

    res.status(200).send({
      message: "Logged In Successfully",
      success: true,
      token,
      staff: {
        ...staff._doc,
        password: undefined, // Avoid sending the password back
      },
    });
  } catch (error) {
    console.error("Error in loginStaff:", error); // Log the full error
    res.status(500).json({ success: false, message: error.message });
  }
};
const registerStaff = async (req, res) => {
  try {
    const existingStaff = await Staff.findOne({
      contactNo: req.body.contactNo,
    });
    if (existingStaff) {
      return res
        .status(200)
        .send({ message: "Staff Already Exist", success: false });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newStaff = new Staff(req.body);
    await newStaff.save();
    res.status(201).json({
      success: true,
      message: "Registered Succesfully !!",
      newStaff,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUserData = async (req, res) => {
  try {
    const staff = await Staff.findById(req.user.id);
    if (!staff) {
      return res
        .status(404)
        .json({ success: false, message: "Staff not found" });
    }
    res.status(200).json({ success: true, data: staff });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteStaff = async (req, res) => {
  try {
    const deletedStaff = await Staff.findByIdAndDelete(req.params.id);
    if (!deletedStaff) {
      return res
        .status(201)
        .json({ success: true, message: "Staff not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Staff deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllStaff,
  loginStaff,
  getUserData,
  registerStaff,
  deleteStaff,
};
