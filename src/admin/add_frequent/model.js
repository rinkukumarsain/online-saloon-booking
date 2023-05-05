const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  blogId: {
    type: mongoose.Types.ObjectId,
    default: null
  },
  question: {
    type: String,
    default: ""
  },
  answer: {
    type: String,
    default: ""
  },

})

module.exports = mongoose.model("FAQ", userSchema);