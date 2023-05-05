const mongoose = require("mongoose");

var ObjectId = require('mongodb').ObjectId;

const saloon_Service = new mongoose.Schema({
    saloonStore: {
        type: ObjectId
    },
    ServiceName: {
        type: String,
    },
    ServicePrice: {
        type: Number
    },
    timePeriod_in_minits: {
        type: Number,
        default: 15
    },
    type: {
        type: String
    },
    image: {
        type: [String],
    },
    description: {
        type: String
    },
    last_category: {
        type: ObjectId,
    },
    category: {
        type: [ObjectId],
    },
    Services: {
        type: [ObjectId],
    },
    FinalPrice: {
        type: Number,
    },
    ServicesType: {
        type: Number,
        default: 0
        //0 service ke liye 
        // pakege se liye 1
    }
}, { timestamps: true });


const saloonService = new mongoose.model("saloonService", saloon_Service);
module.exports = saloonService;


