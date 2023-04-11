const mongoose = require("mongoose");

const letter = new mongoose.Schema({
    email: {
        type: String
    },
    // phone: {
    //     type: Number,
    // },
    // gender: {
    //     type: String,
    // },
    // city: {
    //     type: String
    // },

}, { timestamps: true });


const Newsletter = new mongoose.model("Newsletter", letter);
module.exports = Newsletter;


