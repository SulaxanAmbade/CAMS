const express = require("express");
const {
  createAppointment,
  getAllAppointments,
  updateStatus,
  getDoctorAppointment,
} = require("../controllers/AppointmentController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/createAppointment", createAppointment);
router.get("/getAllAppointments", getAllAppointments);
router.put("/updateStatus/:appointmentId", updateStatus);

router.post("/getDoctorAppointment", getDoctorAppointment);
module.exports = router;
