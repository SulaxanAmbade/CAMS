const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Adjust the path to your User model
const Doctor = require("../models/Doctor"); // Adjust the path to your Doctor model

module.exports = async (req, res, next) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
      if (err) {
        return res.status(700).send({ message: "Invalid Token", success: false });
      }

      try {
        // Check if the user exists in the User collection
        const user = await User.findById(decode.id);
        if (user) {
          req.body.userId = user._id;
          req.body.role = "user"; // Mark role as user
          return next();
        }

        // If not found, check the Doctor collection
        const doctor = await Doctor.findById(decode.id);
        if (doctor) {
          req.body.userId = doctor._id;
          req.body.role = "doctor"; // Mark role as doctor
          return next();
        }

        // If neither found, return error
        return res.status(404).send({ message: "Authentication Failed", success: false });
      } catch (dbError) {
        return res.status(500).send({ message: "Database Error", success: false });
      }
    });
  } catch (error) {
    res.status(401).send({ message: "Authorization Error", success: false });
  }
};
