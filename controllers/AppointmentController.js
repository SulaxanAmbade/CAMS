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

module.exports = { createAppointment, getAllAppointments };
