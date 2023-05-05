const { string } = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: ""
  },
  email: {
    type: String,
    default: ""
  },
  phone: {
    type: Number,
    default: null
  },
  gender: {
    type: String,
    default: ""
  },
  type: {
    type: String,
    default: "user"
  },
  dateOfBirth: {
    type: Date,
    default: ""
  },
  password: {
    type: String
  },
  image: {
    type: String,
    default: ""
  },
  verify: {
    type: Boolean,
    default: false
  },
  otp: {
    type: String
  },
  userWallet: {
    balance: {
      type: Number,
      default: 0
    },
    point: {
      type: Number,
      default: 0
    },
    useBalance: {
      type: Number,
      default: 0
    }
  },
  referalDetails: {
    referalAmount: {
      type: Number
    },
    referaType: {
      type: String
    }
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
  },
  referCode: {
    type: String,
    default: ""
  },
  referId: {
    type: mongoose.Types.ObjectId,
    default: null
  }
}, { timestamps: true });






module.exports = mongoose.model("user", userSchema);