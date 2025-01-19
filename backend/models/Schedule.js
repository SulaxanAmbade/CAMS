const mongoose = require("mongoose");

const ScheduleSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
  date: { type: Date, required: true },
  timeSlots: [
    {
      timeSlot: { type: String, required: true }, // e.g., "09:00"
      isBooked: { type: Boolean, default: false },
      appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" }, // Reference to the appointment if booked
    },
  ],
});

module.exports = mongoose.model("Schedule", ScheduleSchema);
