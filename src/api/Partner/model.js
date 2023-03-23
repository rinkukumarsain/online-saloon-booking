const mongoose = require("mongoose");

var ObjectId = require('mongodb').ObjectId;

const saloon_Requst = new mongoose.Schema({
    userId: {
        type: ObjectId,
        default: null
    },
    storeName: {
        type: String,
    },
    ownerName: {
        type: String,
    },
    password: {
        type: String,
    },
    email: {
        type: String,
    },
    Phone: {
        type: Number
    },
    // image: {
    //     type: [String],
    // },
    location: {
        // shopNumber: {
        //     type: Number
        // },
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
        default: "Unisex"
    },
    status: {
        type: String,
        default: "pending"
    },
    Partner_Size: {
        type: String
    }
}, { timestamps: true });


const saloonRequst = new mongoose.model("saloonRequst", saloon_Requst);
module.exports = saloonRequst;


