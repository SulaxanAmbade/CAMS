const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
// Registration Route
router.post("/register", userController.registerUser);

//
router.post("/login", userController.loginUser);

router.post("/getUserData", authMiddleware, userController.authController);

router.post("/completeProfile", authMiddleware, userController.completeProfile);
module.exports = router;
