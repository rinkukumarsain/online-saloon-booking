const mongoose = require("mongoose");

const city = new mongoose.Schema({
 State: {
  type: String
 },
 District: {
  type: String
 },

}, { timestamps: true });


const citys = new mongoose.model("city", city);
module.exports = citys;


