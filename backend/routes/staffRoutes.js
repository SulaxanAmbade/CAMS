const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");
const {
  getAllStaff,
  loginStaff,
  getUserData,
} = require("../controllers/StaffController");
const router = express.Router();

router.get("/getAllStaff", getAllStaff);
router.post("/login", loginStaff);
router.post("/getUserData", authMiddleware, getUserData);
module.exports = router;
