const express = require("express");
const User = require("../models/Users");
const router = express.Router();
// For Express Validation
const { body, validationResult } = require("express-validator");
const { findOne } = require("../models/Users");

// Signup Route For User , Doesnot Require Auth
router.post(
  "/signup", // username must be an email
  body("email", "Enter A Valid Email").isEmail(),
  // password must be at least 5 chars long
  body("password", "Minimum Length For Passord Is 6 ").isLength({ min: 5 }),
  async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Try Catch For Async await
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(401).json({ error: "Email Is Already Registered !" });
      }
      user = await Userd.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    }
  }
);

module.exports = router;
