const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
    },
    orderData: {
        id: {
            type: String
        },
        entity: {
            type: String
        },
        amount: {
            type: Number
        },
        amount_paid: {
            type: Number
        },
        amount_due: {
            type: Number
        },
        currency: {
            type: String
        },
        receipt: {
            type: String
        },
        offer_id: {
            type: String
        },
        status: {
            type: String
        },
        attempts: {
            type: Number
        },
        notes: {
            type: [String]
        },
        created_at: {
            type: String
        },
    },
    orderId: {
        type: mongoose.Types.ObjectId,
    },
    payment: {
        type: String,
        default: "pending"
    },
    payment_detail: {
        razorpay_payment_id: {
            type: String,
            default: ""
        },
        razorpay_order_id: {
            type: String,
            default: ""
        },
        razorpay_signature: {
            type: String,
            default: ""
        },
    }

}, { timestamps: true });

module.exports = mongoose.model("payment", paymentSchema);