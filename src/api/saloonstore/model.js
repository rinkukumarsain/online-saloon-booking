const mongoose = require("mongoose");

var ObjectId = require('mongodb').ObjectId;

const saloon_Store = new mongoose.Schema({
    userId: {
        type: ObjectId
    },
    storeName: {
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
    },
    description: {
        type: String
    }
})


const saloon = new mongoose.model("saloon", saloon_Store)
module.exports = saloon;

