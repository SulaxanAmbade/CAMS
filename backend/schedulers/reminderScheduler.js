const cron = require("node-cron");
const moment = require("moment-timezone"); // ✅ Use moment-timezone
const admin = require("../config/firebaseAdmin");
const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");

// Set your timezone
const TIMEZONE = "Asia/Kolkata"; // IST

// Run every 15 minutes
cron.schedule("*/15 * * * *", async () => {
  console.log("⏰ Running multi-hour reminder scheduler...");

  const now = moment().tz(TIMEZONE);

  try {
    // Fetch all confirmed future appointments
    const appointments = await Appointment.aggregate([
      {
        $match: { status: "Confirmed" }
      },
      {
        $addFields: {
          appointmentDateTime: {
            $dateFromString: {
              dateString: {
                $concat: [
                  { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                  "T",
                  "$time"
                ]
              }
            }
          }
        }
      },
      {
        $match: {
          appointmentDateTime: { $gte: new Date() }
        }
      }
    ]);

    for (const appointment of appointments) {
      const appointmentTime = moment(`${appointment.date} ${appointment.time}`, "YYYY-MM-DD HH:mm").tz(TIMEZONE);
      const diffInHours = appointmentTime.diff(now, "hours");

      // Allowed intervals: 24, 22, 20, ..., 2
      if (diffInHours % 2 === 0 && diffInHours >= 2 && diffInHours <= 24) {
        // Get the full appointment document to access remindersSent and patient info
        const fullAppointment = await Appointment.findById(appointment._id).populate("patientId");

        if (!fullAppointment) continue;

        const patient = fullAppointment.patientId;
        const fcmToken = patient?.fcmToken;

        if (!fcmToken) continue;

        // Check if this reminder was already sent
        if (fullAppointment.remindersSent?.includes(diffInHours)) continue;

        const message = {
          notification: {
            title: "⏰ Appointment Reminder",
            body: `You have an appointment in ${diffInHours} hours at ${appointment.time}.`,
          },
          token: fcmToken,
        };

        try {
          await admin.messaging().send(message);
          console.log(`✅ Sent ${diffInHours}h reminder to ${patient.name}`);

          // Save this hour to prevent duplicate reminders
          fullAppointment.remindersSent.push(diffInHours);
          await fullAppointment.save();
        } catch (error) {
          console.error(`❌ Failed to send to ${patient.name}:`, error);
        }
      }
    }
  } catch (err) {
    console.error("Error in multi-hour reminder scheduler:", err);
  }
});
