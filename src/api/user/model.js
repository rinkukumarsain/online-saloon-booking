const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, default: null },
  phone: { type: String, default: null },
  email: { type: String, unique: true },
  password: { type: String },
  otp: { type: String },
  token: { type: String },
});

module.exports = mongoose.model("user", userSchema);