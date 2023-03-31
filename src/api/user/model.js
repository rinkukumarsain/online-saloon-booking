const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: null
  },
  email: {
    type: String,
    // unique: true                                          
  },
  phone: {
    type: Number,
    default: null
  },
  gender: {
    type: String
  },
  type: {
    type: String,
    default: "user"
  },
  dateOfBirth: {
    type: Date
  },
  password: {
    type: String
  },
  image: {
    type: String
  },
  verify: {
    type: Boolean,
    default: false
  },
  otp: {
    type: String
  },
  location: {
    aria: {
      type: String,
      default: ""
    },
    pincode: {
      type: String,
      default: ""
    },
    city: {
      type: String,
      default: ""
    },
    state: {
      type: String,
      default: ""
    },
  },
  auth: {
    type: String,
    default: ""
  }
}, { timestamps: true });






module.exports = mongoose.model("user", userSchema);