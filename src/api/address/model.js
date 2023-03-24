const { string } = require("joi");
const { mongoose, ObjectId } = require("mongoose");
const address = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId
    },
    type: {
        type: String
    },
    name: {
        type: String
    },
    phone: {
        type: String
    },
    makeDefault: {
        type: Boolean,
        default: false
    },
    location: {
        houseNumber: {
            type: Number
        },
        aria: {
            type: String
        },
        pincode: {
            type: String
        },
        city: {
            type: String
        },
        state: {
            type: String
        },

    }
}, { timestamps: true });

const userAddress = new mongoose.model("userAddress", address);
module.exports = userAddress;
