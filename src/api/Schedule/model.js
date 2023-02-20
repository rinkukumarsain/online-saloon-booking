const mongoose = require("mongoose");

const schedul = new mongoose.Schema({

    userId: {
        type: mongoose.Types.ObjectId
    },
    saloonId: {
        type: mongoose.Types.ObjectId
    },
    cartId: {
        type: mongoose.Types.ObjectId
    },
    date: {
        type: String,
    },
    timeslot: {
        type: String,
    },

}, { timestamps: true });

const schedule = new mongoose.model("schedule", schedul);
module.exports = schedule;
