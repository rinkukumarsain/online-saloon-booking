const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  question: {
    type: String,
    default: null
  },
  answer: {
    type: String,
    // unique: true
    default: null
  }
})

module.exports = mongoose.model("FAQ", userSchema);