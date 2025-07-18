// controllers/appointmentController.js
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");

// Book Appointment Controller
const moment = require("moment"); // Make sure to import moment

const createAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, date, slotTime, status, remarks } = req.body;
    const patient = await Patient.findById(patientId);
    const doctor = await Doctor.findById(doctorId);

    if (!patient || !doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid patient or doctor ID." });
    }

    // Prevent double booking by the same patient for same doctor, date & slot
    const existingAppointment = await Appointment.findOne({
      patientId,
      doctorId,
      date,
      slotTime,
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message:
          "You already have an appointment booked with this doctor in this time slot.",
      });
    }

    // Count existing appointments for this doctor on the given date and time slot
    const slotCount = await Appointment.countDocuments({
      doctorId,
      date,
      slotTime,
    });

    if (slotCount >= 8) {
      return res.status(400).json({
        success: false,
        message: "This time slot is fully booked. Please choose another.",
      });
    }

    const appointment = new Appointment({
      patientId,
      doctorId,
      date,
      slotTime,
      status,
      remarks,
    });

    await appointment.save();

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully.",
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error booking appointment.",
      error: error.message,
    });
  }
};

module.exports = { createAppointment };

const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate({ path: "patientId", select: "name" })
      .populate({ path: "doctorId", select: "name" });
    res.status(200).json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.error("Error fetching appointments:", error); // Log the error details
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
const getDoctorAppointment = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctorId: req.body.userID })
      .populate({ path: "patientId", select: "name" })
      .populate({ path: "doctorId", select: "name" });

    // Check if appointments are empty
    if (!appointments || appointments.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No appointments found for this doctor.`,
      });
    }

    // Return appointments if found
    res.status(200).json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.error("Error fetching appointments:", error); // Log the error details
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getPatientAppointment = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.body.userID })
      .populate({ path: "patientId", select: "name" })
      .populate({ path: "doctorId", select: "name" });

    // Check if appointments are empty
    if (!appointments || appointments.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No appointments found for this patient.`,
      });
    }

    // Return appointments if found
    res.status(200).json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.error("Error fetching appointments:", error); // Log the error details
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getAppointmentsByPatientId = async (req, res) => {
  try {
    const { patientId } = req.params;
    const appointments = await Appointment.find({ patientId }).populate({
      path: "doctorId",
      select: "name",
    });
    if (!appointments || appointments.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No appointments found for this patient.",
      });
    }

    res.status(200).json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.error("Error fetching patient appointments:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "Pending",
      "Cancelled",
      "Completed",
      "No-Show",
      "Confirmed",
    ];

    // Ensure the status provided is valid
    if (
      !validStatuses.map((s) => s.toLowerCase()).includes(status.toLowerCase())
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status value." });
    }

    // Find the appointment by ID
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found." });
    }

    // Validate patient and doctor existence
    const patient = await Patient.findById(appointment.patientId);
    const doctor = await Doctor.findById(appointment.doctorId);

    if (!patient || !doctor) {
      appointment.status = "Cancelled"; // Set to cancelled if either is missing
    } else {
      appointment.status = status; // Otherwise, update the status normally
    }

    // Save the updated appointment
    await appointment.save();

    res.status(200).json({
      success: true,
      message: `Appointment status updated to ${appointment.status}.`,
      appointment,
    });
  } catch (error) {
    console.error("Error updating appointment status:", error.stack);
    res.status(500).json({
      success: false,
      message: "Error updating appointment status.",
      error: error.message,
    });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    // Check if the appointment exists
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found." });
    }

    // Delete the appointment
    await Appointment.findByIdAndDelete(appointmentId);
    res.status(200).json({
      success: true,
      message: "Appointment deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting appointment.",
      error: error.message,
    });
  }
};

module.exports = {
  createAppointment,
  getAllAppointments,
  deleteAppointment,
  updateStatus,
  getDoctorAppointment,
  getPatientAppointment,
  getAppointmentsByPatientId,
};
