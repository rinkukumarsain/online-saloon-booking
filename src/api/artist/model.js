const mongoose = require("mongoose");

const Artist = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        default: null
    },
    skiils: {
        type: [String],
    },

}, { timestamps: true });


const artist = new mongoose.model("artist", Artist);
module.exports = artist;


