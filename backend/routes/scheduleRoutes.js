const express = require("express");
const router = express.Router();
const { generateScheduleForDoctor, getDoctorSchedule } = require("../controllers/scheduleController");

// Endpoint to generate a schedule
router.post("/generate/:doctorId/:date", generateScheduleForDoctor);
// Endpoint to fetch the doctor's schedule for a specific date
router.get("/:doctorId/:date", getDoctorSchedule);

module.exports = router;
