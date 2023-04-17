const mongoose = require("mongoose");

const Safety = new mongoose.Schema({
    Title: {
        type: String,
    },
    Amount: {
        type: Number,
    },
    CouponCode: {
        type: String,
    },
    StartDate: {
        // type: Date
        type: String
    },
    EndDate: {
        // type: Date
        type: String

    },
    Limit: {
        type: Number
    },
    Discount: {
        type: Number,
        default: "0"
    },
}, { timestamps: true });


const SafetyProgram = new mongoose.model("SafetyProgram", Safety);
module.exports = SafetyProgram;
