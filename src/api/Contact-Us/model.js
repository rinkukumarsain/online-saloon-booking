const mongoose = require("mongoose");
const ContactUs = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    services: {
        type: String,
    },
    phone: {
        type: Number
    },
    message: {
        type: String,
    },
    status: {
        type: Number,
        default: 0
    }
}, { timestamps: true });


const Contact = new mongoose.model("Contact", ContactUs);
module.exports = Contact;
