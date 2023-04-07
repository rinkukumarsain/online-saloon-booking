const faq = require("../../admin/add_frequent/model");

const mongoose = require("mongoose")


exports.getFaq = async ({ query, user }) => {
    try {
        let result;
        if (query.id != undefined && query.id != "") {
            result = await faq.find({ _id: mongoose.Types.ObjectId(query.id) });
        } else {
            result = await faq.find();
        };
        if (result) {
            return {
                statusCode: 200,
                status: true,
                message: "order  successful !",
                data: [result]
            };
        } else {
            return {
                statusCode: 400,
                status: false,
                message: "Your Cart Is Empty !",
                data: []
            };
        };
    } catch (error) {
        console.log(error)
    };
};
