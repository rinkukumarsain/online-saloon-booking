const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: null
  },
  phone: {
    type: Number,
    default: null
  },
  email: {
    type: String,
    // unique: true
  },
  password: {
    type: String
  },
  otp: {
    type: String
  },
  token: {
    type: String
  },
  verify: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("user", userSchema);