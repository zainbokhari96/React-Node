import mongoose from "mongoose";
const { Schema } = mongoose;

const notesSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    default: "General",
  },
  date: {
    type: date,
    default: Date.now,
  },
});

module.exports = mongoose.model("user", userSchema);
