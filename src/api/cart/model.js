const mongoose = require("mongoose");
const usercart = new mongoose.Schema({
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
    Package: {
        type: [mongoose.Types.ObjectId]
    },
    totalamount: {
        type: Number,
    },
    disCount: {
        type: Number,
        default: 0
    },
    pay: {
        type: Number,
        default: 0
    },
    addressId: {
        type: mongoose.Types.ObjectId,
        default: null
    }
}, { timestamps: true });


const cart = new mongoose.model("cart", usercart);
module.exports = cart;
