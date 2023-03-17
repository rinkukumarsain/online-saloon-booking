const mongoose = require("mongoose");

const Blog = new mongoose.Schema({
    category: {
        type: mongoose.Types.ObjectId,
        default: null
    },
    Title: {
        type: String,
    },
    image: {
        type: [String],
    },
    WriterName: {
        type: String,
    },
    WriteDate: {
        type: String
    },
    Description: {
        type: String,
    }
}, { timestamps: true });


const blog = new mongoose.model("blog", Blog);
module.exports = blog;


