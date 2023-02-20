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
    serviceProvider: {
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
        default: null
    }
}, { timestamps: true });


const saloonService = new mongoose.model("saloonService", saloon_Service);
module.exports = saloonService;


