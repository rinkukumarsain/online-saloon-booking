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
    addressId: {
        type: mongoose.Types.ObjectId
    },
    ScheduleId: {
        type: mongoose.Types.ObjectId
    },
    paymentStatus: {
        type: String,
        default: "panding"
    },
    status: {
        type: String,
        default: "panding"
    },
    orderId: {

    }

}, { timestamps: true });


const order = new mongoose.model("order", orderSchema);
module.exports = order;
