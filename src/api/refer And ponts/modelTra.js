const mongoose = require("mongoose");

const ConvertTra = new mongoose.Schema({
 userId: {
  type: mongoose.Types.ObjectId,
  // default: null
 },
 referPlanId: {
  type: mongoose.Types.ObjectId,
  default: null
 },
}, { timestamps: true });


const referTransaction = new mongoose.model("referTransaction", ConvertTra);
module.exports = referTransaction;


