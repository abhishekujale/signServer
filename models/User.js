const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const saltRounds = process.env.SALT_ROUNDS || 10;

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    trim: true,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/.+\@.+\..+/, "Please fill a valid email address"],
  },
  password: {
    type: String,
  },
  progress: {
    type: String,
    default: 0, // Starting progress at 0
  },
});

module.exports = mongoose.model("User", userSchema);
