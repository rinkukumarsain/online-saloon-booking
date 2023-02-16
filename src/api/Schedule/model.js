const mongoose = require("mongoose");
// const { mongoose, ObjectId } = require("mongoose");
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
    /* cartdata: [{
         serviceId: {
             type: mongoose.Types.ObjectId
         },
         quantity: {
             type: Number,
         },
         Amount: {
             type: String,
         },
         timePeriod_in_minits: {
             type: Number,
         },
         _id: false
     }],
     totalamount: {
         type: Number,
     },*/
}, { timestamps: true })

const schedule = new mongoose.model("schedule", schedul)
module.exports = schedule;
