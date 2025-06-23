const cron = require("node-cron");
const moment = require("moment");
const admin = require("../config/firebaseAdmin");
const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");

// Runs every 15 minutes
cron.schedule("*/15 * * * *", async () => {
  console.log("⏰ Running 24-hour prior appointment reminder...");

  const now = moment();
  const in24Hours = moment().add(24, "hours");

  try {
    // Find confirmed appointments between now+24h and now+24h+15min
    const appointments = await Appointment.find({
      status: "Confirmed",
      $expr: {
        $lte: [
          {
            $subtract: [
              {
                $dateFromString: {
                  dateString: {
                    $concat: ["$date", "T", "$time"],
                  },
                },
              },
              new Date(),
            ],
          },
          1000 * 60 * 15, // 15 minutes in ms
        ],
      },
    }).populate("patientId");

    for (const appointment of appointments) {
      const patient = appointment.patientId;
      const fcmToken = patient.fcmToken;

      if (!fcmToken) continue;

      const appointmentTime = moment(
        `${appointment.date} ${appointment.time}`,
        "YYYY-MM-DD HH:mm"
      );

      // Only send if it's exactly 24 hours before
      const timeDiff = appointmentTime.diff(now, "minutes");

      if (timeDiff >= 1439 && timeDiff <= 1441) {
        const message = {
          notification: {
            title: "⏰ Appointment Reminder",
            body: `You have an appointment in 24 hours at ${appointment.time}.`,
          },
          token: fcmToken,
        };

        try {
          await admin.messaging().send(message);
          console.log(`✅ Reminder sent to: ${patient.name}`);
        } catch (error) {
          console.error(`❌ Failed to send to ${patient.name}:`, error);
        }
      }
    }
  } catch (err) {
    console.error("Error in reminder scheduler:", err);
  }
});
