const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");
const admin = require("../config/firebaseAdmin");
const twilioClient = require("../config/twilioClient");

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

    const { name, fcmToken, contactNo } = appointment.patientId;
    const appointmentDate = appointment.date.toDateString();
    const appointmentTime = appointment.time;

    // ----- 🔔 Push Notification -----
    if (fcmToken) {
      const notification = {
        notification: {
          title: title || "📢 Appointment Reminder",
          body:
            message ||
            `Hi ${name}, your appointment is on ${appointmentDate} at ${appointmentTime}.`,
        },
        token: fcmToken,
      };

      await admin.messaging().send(notification);
    }

    // ----- 📱 SMS Notification -----
    if (contactNo) {
      const smsBody =
        message ||
        `Hi ${name}, this is a reminder for your appointment on ${appointmentDate} at ${appointmentTime}.`;

      await twilioClient.messages.create({
        body: smsBody,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: `+91${contactNo}`, // Assuming Indian numbers
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification and SMS sent successfully",
    });
  } catch (error) {
    console.error("Error sending reminder:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send notification or SMS",
      error: error.message,
    });
  }
});

module.exports = router;
