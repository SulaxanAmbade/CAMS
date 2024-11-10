const express = require("express");
const {
    createAppointment,
  getAllAppointments,
} = require("../controllers/AppointmentController");
const router = express.Router();

router.post("/createAppointment", createAppointment);
router.get("/getAllAppointments", getAllAppointments);

module.exports = router;
