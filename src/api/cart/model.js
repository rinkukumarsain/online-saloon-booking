const mongoose = require("mongoose");
// const { mongoose, ObjectId } = require("mongoose");
const usercart = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId
    },
    saloonId: {
        type: mongoose.Types.ObjectId
    },
    cartdata: [{
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
    },
}, { timestamps: true })


const cart = new mongoose.model("cart", usercart)
module.exports = cart;


/*const mongoose = require("mongoose");

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
*/

