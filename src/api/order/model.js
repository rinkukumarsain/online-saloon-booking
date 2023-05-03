const { string } = require("joi");
const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId
    },
    saloonId: {
        type: mongoose.Types.ObjectId
    },
    cartdata: [{
        serviceId: {
            type: mongoose.Types.ObjectId
        },
        quantity: {
            type: Number,
        },
        Amount: {
            type: String,
        },
        timePeriod_in_minits: {
            type: Number,
        },
        _id: false
    }],
    totalamount: {
        type: Number,
    },
    couponId: {
        type: mongoose.Types.ObjectId,
        default: null
    },
    Discount: {
        type: Number,
    },
    finalTotalAmount: {
        type: Number,
    },
    addressId: {
        type: mongoose.Types.ObjectId,
        default: null
    },
    PaymentId: {
        type: mongoose.Types.ObjectId
    },
    Schedule: {
        date: {
            type: String
        },
        timeslot: {
            type: String
        },
    },
    paymentStatus: {
        type: String,
        default: "pending"
    },
    status: {
        type: String,
        default: "pending"
    },
    orderId: {

    }

}, { timestamps: true });


const order = new mongoose.model("order", orderSchema);
module.exports = order;
