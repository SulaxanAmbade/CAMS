// controllers/appointmentController.js
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");

// Book Appointment Controller
const moment = require("moment"); // Make sure to import moment

const createAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, date, time } = req.body;

    // Check if the patient and doctor IDs are valid
    const patient = await Patient.findById(patientId);
    const doctor = await Doctor.findById(doctorId);
    if (!patient || !doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid patient or doctor ID." });
    }

    // Get the doctor's time slot duration in minutes
    const slotDuration = doctor.visitingHours.slot;

    // Convert requested time to a moment object for easier manipulation
    const appointmentStartTime = moment(time, "HH:mm");

    // Fetch all appointments for the doctor on the specified date
    const appointments = await Appointment.find({
      doctorId,
      date: new Date(date).toISOString().split("T")[0], // Match appointments on the same day
    });

    // Check for overlaps with each existing appointment
    for (const existingAppointment of appointments) {
      const existingAppointmentStart = moment(
        existingAppointment.time,
        "HH:mm"
      );
      const existingAppointmentEnd = existingAppointmentStart
        .clone()
        .add(slotDuration, "minutes");

      // Check if the new appointment start time is within the existing appointment range
      if (
        appointmentStartTime.isBetween(
          existingAppointmentStart,
          existingAppointmentEnd,
          null,
          "[)"
        )
      ) {
        return res
          .status(400)
          .json({ success: false, message: "Time slot already booked." });
      }
    }

    // If no overlaps, create the new appointment
    const appointment = new Appointment({
      patientId,
      doctorId,
      date,
      time,
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
};
