const express = require("express");
const {
  getAllDoctors,
  addDoctor,
  deleteDoctor,
  doctorLogin,
  getUserData,
} = require("../controllers/DoctorController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/getAllDoctors", getAllDoctors);

router.post("/addNewDoctor", addDoctor);

router.delete("/deleteDoctor/:id", deleteDoctor);

router.post("/login", doctorLogin);

router.post("/getUserData", authMiddleware, getUserData);

module.exports = router;
