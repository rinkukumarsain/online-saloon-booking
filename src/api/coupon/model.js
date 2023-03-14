const mongoose = require("mongoose");

const coupons = new mongoose.Schema({
    Titel: {
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


const coupon = new mongoose.model("coupon", coupons);
module.exports = coupon;
