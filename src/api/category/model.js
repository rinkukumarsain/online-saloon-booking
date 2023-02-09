const mongoose = require("mongoose");

const add_Category = new mongoose.Schema({
    parent_Name: {
        type: mongoose.Types.ObjectId,
        default: null
    },
    Name: {
        type: String,
    },
    image: {
        type: String,
    }
})


const category = new mongoose.model("category", add_Category)
module.exports = category;


