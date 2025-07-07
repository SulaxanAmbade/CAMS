const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");
const admin = require("../config/firebaseAdmin"); // your Firebase admin instance

// POST /api/v1/notification/send-custom-reminder
router.post("/send-custom-reminder", async (req, res) => {
  const { appointmentId, title, message } = req.body;

  try {
    const appointment = await Appointment.findById(appointmentId).populate(
      "patientId"
    );

    if (!appointment || !appointment.patientId) {
      return res.status(404).json({
        success: false,
        message: "Appointment or patient not found",
      });
    }

    const fcmToken = appointment.patientId.fcmToken;

    if (!fcmToken) {
      return res.status(400).json({
        success: false,
        message: "Patient does not have an FCM token",
      });
    }

    const notification = {
      notification: {
        title: title || "📢 Appointment Reminder",
        body:
          message ||
          `Reminder: Your appointment is on ${appointment.date.toDateString()} at ${
            appointment.time
          }`,
      },
      token: fcmToken,
    };

    await admin.messaging().send(notification);

    return res.status(200).json({
      success: true,
      message: "Notification sent successfully",
    });
  } catch (error) {
    console.error("Error sending reminder notification:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send notification",
      error: error.message,
    });
  }
});

module.exports = router;
