const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");
const { getAllStaff, loginStaff } = require("../controllers/StaffController");
const router = express.Router();

router.get("/getAllStaff", getAllStaff);
router.post("/login", loginStaff);
module.exports = router;
