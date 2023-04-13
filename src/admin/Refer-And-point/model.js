const mongoose = require("mongoose");

const refers = new mongoose.Schema({
 rupee: {
  type: Number,
  default: 0
 },
 point: {
  type: Number,
  default: 0
 },
}, { timestamps: true });


const refer = new mongoose.model("refer", refers);
module.exports = refer;


