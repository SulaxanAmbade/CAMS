const Doctor = require("../models/Doctor");
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    if (doctors.length === 0) {
      return res
        .status(201)
        .json({ success: true, message: "No doctors found" });
    }

    res.status(200).json({ success: true, data: doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addDoctor = async (req, res) => {
  try {
    const DoctorData = new Doctor(req.body);
    const savedDoctor = await DoctorData.save();
    res.status(201).json({ success: true, data: savedDoctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteDoctor = async (req, res) => {
  try {
    const deletedDoctors = await Doctor.findByIdAndDelete(req.params.id);
    if (!deletedDoctors) {
      return res
        .status(201)
        .json({ success: true, message: "Doctor not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Doctor deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllDoctors,
  addDoctor,
  deleteDoctor,
};
