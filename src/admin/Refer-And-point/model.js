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
 // referAmount: {
 //  type: Number,
 //  default: "0"
 // },
 // rewardType: {
 //  type: String,
 //  default: "point"
 // }
}, { timestamps: true });


const refer = new mongoose.model("refer", refers);
module.exports = refer;


