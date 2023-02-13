const mongoose = require("mongoose");

var ObjectId = require('mongodb').ObjectId;

const saloon_Service = new mongoose.Schema({
    ServiceName: {
        type: String,
    },
    ServicePrice: {
        type: Number
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
})


const saloonService = new mongoose.model("saloonService", saloon_Service)
module.exports = saloonService;


