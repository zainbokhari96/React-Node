const express = require("express");
const User = require("../models/Users");
const router = express.Router();
// For Express Validation
const { body, validationResult } = require("express-validator");
// Import Bycrypt Librar For Password Encryption
const bcrypt = require("bcryptjs");
//  Import JWT For Login Token
const jwt = require("jsonwebtoken");
// Private Key Must Be Save In ENV Files Not Here , Must Read From ENV Files In Production
const privateKey = "ZainPrivateKeyForTesting";
// Import Middleware For User Authentication
var verifyToken = require('../middleware/verifyToken');

// Signup Route For User , Doesnot Require Login
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
      //   Add Encryption For Password Hashing
      let salt = await bcrypt.genSaltSync(10);
      let hashedPassword = await bcrypt.hashSync(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      });
      return res.status(200).json({ message: "User Created Successfully !" });
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Login Route For User , Doesnot Require Login
router.post(
  "/login", // username must be an email
  body("email", "Enter A Valid Email").isEmail(),
  // password must be at least 5 chars long
  body("password", "Password Cannot Be Blank").exists(),
  async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Try Catch For Async await
    try {
      const { email, password } = req.body;
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: "User Not Exists" });
      }
      //   Compare Encrpyted Password From DB
      const comparedPassword = await bcrypt.compare(password, user.password);
      if (!comparedPassword) {
        return res
          .status(401)
          .json({ message: "Please Login With Correct Credentials" });
      }
      const token = await jwt.sign({ id: user.id }, privateKey);
      return res.status(200).json({ token: token });
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Fetch User Detail Route With Middleware
router.post("/get-user", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
