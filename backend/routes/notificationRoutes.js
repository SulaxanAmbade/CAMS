const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");
const admin = require("../config/firebaseAdmin");
const sendFast2Sms = require("../utils/sendFast2SMS");

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

    const finalMessage =
      message ||
      `Hi ${name}, this is a reminder for your appointment on ${appointmentDate} at ${appointmentTime}.`;

    // ---- 🔔 Push Notification via FCM ----
    if (fcmToken) {
      const notification = {
        notification: {
          title: title || "📢 Appointment Reminder",
          body: finalMessage,
        },
        token: fcmToken,
      };

      await admin.messaging().send(notification);
    }

    // ---- 📱 SMS Notification via Fast2SMS ----
    if (contactNo) {
      const smsResponse = await sendFast2Sms(`${contactNo}`, finalMessage); // Assumes Indian numbers

      if (!smsResponse.success) {
        console.error("❌ SMS failed:", smsResponse.error);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Push and SMS reminder sent successfully",
    });
  } catch (error) {
    console.error("❌ Reminder error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send reminder",
      error: error.message,
    });
  }
});

module.exports = router;
