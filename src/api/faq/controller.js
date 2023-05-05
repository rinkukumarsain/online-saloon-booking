const faq = require("../../admin/add_frequent/model");
const mongoose = require("mongoose")

exports.getFaq = async ({ query }) => {
    try {
        let obj = {};
        if (query.question != undefined && query.question != "") {
            obj.question = { '$regex': query.question }
        } else if (query.id != undefined && query.id != "") {
            obj._id = mongoose.Types.ObjectId(query.id)
        } else {
            obj.answer = { $ne: null }
        };
        const result = await faq.find(obj);
        if (result) {
            return {
                statusCode: 200,
                status: true,
                message: "faq if Find successful !",
                data: [result]
            };
        } else {
            return {
                statusCode: 400,
                status: false,
                message: "faq if Find not find !",
                data: []
            };
        };
    } catch (error) {
        console.log(error)
    };
};

exports.AskQustion = async ({ query }) => {
    try {
        const faqdetail = new faq({
            question: query.qustion,
        });
        const result = await faqdetail.save();
        if (result) {
            return {
                statusCode: 200,
                status: true,
                message: "Thank you for asking a question!",
                data: []
            };
        } else {
            return {
                statusCode: 400,
                status: false,
                message: "Something is wrong !",
                data: []
            };
        };
    } catch (error) {
        console.log(error);
    };
};