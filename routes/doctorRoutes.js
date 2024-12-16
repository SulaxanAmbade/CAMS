const express = require("express");
const {
  getAllDoctors,
  addDoctor,
  deleteDoctor,
  doctorLogin,
} = require("../controllers/DoctorController");
const router = express.Router();

router.get("/getAllDoctors", getAllDoctors);

router.post("/addNewDoctor", addDoctor);

router.delete("/deleteDoctor/:id", deleteDoctor);

router.post("/login", doctorLogin);

module.exports = router;
