const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        // default: null
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
    payment: {
        type: String,
        default: "panding"
    }

}, { timestamps: true });

module.exports = mongoose.model("payment", paymentSchema);