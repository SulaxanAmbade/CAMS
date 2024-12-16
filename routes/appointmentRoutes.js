const express = require("express");
const {
  createAppointment,
  getAllAppointments,
  updateStatus,
} = require("../controllers/AppointmentController");
const router = express.Router();

router.post("/createAppointment", createAppointment);
router.get("/getAllAppointments", getAllAppointments);
router.put("/updateStatus/:appointmentId", updateStatus);
module.exports = router;
