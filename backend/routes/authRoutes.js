const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { authController } = require("../controllers/userController");

router.post("/getUserData", authMiddleware, authController);

module.exports = router;
