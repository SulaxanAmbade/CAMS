const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");
const {
  getAllStaff,
  loginStaff,
  getUserData,
  registerStaff,
  deleteStaff,
} = require("../controllers/StaffController");
const router = express.Router();

router.get("/getAllStaff", getAllStaff);
router.post("/login", loginStaff);
router.post("/register", registerStaff);

router.delete("/staffDelete/:id", deleteStaff);
router.post("/getUserData", authMiddleware, getUserData);
module.exports = router;
