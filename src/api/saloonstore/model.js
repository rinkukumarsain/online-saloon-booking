const mongoose = require("mongoose");

var ObjectId = require('mongodb').ObjectId;

const saloon_Store = new mongoose.Schema({
    userId: {
        type: ObjectId
    },
    storeName: {
        type: String,
    },
    password: {
        type: String,
    },
    confirmpassword: {
        type: String,
    },
    Email: {
        type: String,
    },
    PhoneNumber: {
        type: Number
    },
    image: {
        type: [String],
    },
    location: {
        shopNumber: {
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
        fulladdress: {
            type: String
        },
    },
    category: {
        type: [String]
    },
    type: {
        type: String,
        default: "Unisex"
    },
    description: {
        type: String
    }
}, { timestamps: true });


const saloon = new mongoose.model("saloon", saloon_Store);
module.exports = saloon;


