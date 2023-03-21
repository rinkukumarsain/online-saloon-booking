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

    },
    category: {
        type: [String]
    },
    type: {
        type: String,
        default: "unisex"
    },
    description: {
        type: String
    },
    weekRange: {
        type: String
    },
    startingweek: { type: String },
    endingweek: { type: String },
    starting_time: { type: String },
    ending_time: { type: String },
    TimeRange: {
        type: String
    }
}, { timestamps: true });

//   'starting-time': '22:14',
//   'ending-time': '20:10',
//   startingweek: 'Saturday',
//   endingweek: 'Sunday',

const saloon = new mongoose.model("saloon", saloon_Store);
module.exports = saloon;


