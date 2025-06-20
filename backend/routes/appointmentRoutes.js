const express = require("express");
const {
  createAppointment,
  getAllAppointments,
  updateStatus,
  getDoctorAppointment,
  getPatientAppointment,
  getAppointmentsByPatientId,
} = require("../controllers/AppointmentController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/createAppointment", createAppointment);
router.get("/getAllAppointments", getAllAppointments);
router.put("/updateStatus/:appointmentId", updateStatus);

router.post("/getDoctorAppointment", getDoctorAppointment);
router.post("/getPatientAppointment", getPatientAppointment);
router.get(
  "/getAppointmentsByPatientId/:patientId",
  getAppointmentsByPatientId
);

module.exports = router;
