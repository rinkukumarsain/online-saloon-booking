const mongoose = require("mongoose");

const Transaction = new mongoose.Schema({
 userId: {
  type: mongoose.Types.ObjectId
 },
 moneyType: {
  type: String
 },
 type: {
  type: String
 },
 orderId: {
  type: mongoose.Types.ObjectId,
  default: null
 },
 fromUserId: {
  type: mongoose.Types.ObjectId,
  default: null
 },
 tragactionId: {
  type: Number
 },
 amount: {
  type: Number
 },
 status: {
  type: String
 },
 description: {
  type: String
 }
}, { timestamps: true });


const walletTransaction = new mongoose.model("walletTransaction", Transaction);
module.exports = walletTransaction;


