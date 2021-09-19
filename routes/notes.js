const express = require("express");
const Notes = require("../models/Notes");
const router = express.Router();
// For Express Validation
const { body, validationResult } = require("express-validator");
// Import Middleware For User Authentication
var verifyToken = require("../middleware/verifyToken");

// Route For Fetch All Notes Of User , Login Required
router.post("/fetch-all-notes", verifyToken, async (req, res) => {
  const notes = await Notes.find({ user: req.user.id });
  res.json(notes);
});

// Route For Add New Note Of User , Login Required
router.post(
  "/add-notes",
  verifyToken,
  [
    body("title", "Enter A Valid Email").isLength({ min: 3 }),
    // Description must be at least 5 chars long
    body("description", "Minimum Length For Passord Is 6 ").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Try Catch For Async await
    try {
      const { title, description, tag } = req.body;
      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const newNote = await note.save();
      res.json(newNote);
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    }
  }
);

module.exports = router;
