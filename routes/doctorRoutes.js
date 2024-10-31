const express = require("express");
const { getAllDoctors, addDoctor, deleteDoctor } = require("../controllers/DoctorController");
const router = express.Router();

router.get("/getAllDoctors", getAllDoctors);

router.post("/addNewDoctor", addDoctor);

router.delete("deleteDoctor/:id", deleteDoctor)


module.exports = router;