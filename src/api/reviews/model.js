const mongoose = require("mongoose");

const reviews = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
    },
    saloonId: {
        type: mongoose.Types.ObjectId,
    },
    Rating: {
        type: Number,
    },
    Date: {
        type: String,
    },
    Description: {
        type: String,
    }
}, { timestamps: true });


const review = new mongoose.model("review", reviews);
module.exports = review;


