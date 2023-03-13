const review = require("./model")
const category = require("../category/model")
const mongoose = require("mongoose")
const { getreviews } = require("./services")

exports.addReviews = async ({ body, user, query }) => {
    try {
        let obj = {};
        if (query.id != undefined && query.id != "") {
            let _id = mongoose.Types.ObjectId(query.id)
            if (body.Rating != undefined && body.Rating != "") {
                obj.Rating = body.Rating;
            }
            if (body.Description != undefined && body.Description != "") {
                obj.Description = body.Description;
            }
            const updateDate = await review.findByIdAndUpdate({ _id }, obj, { new: true })
            if (updateDate) {
                return {
                    statusCode: 200,
                    status: true,
                    message: `your review updateDate successfull !`,
                    data: [updateDate]
                };
            };

        } else {
            if (body.Rating != undefined && body.Rating != "") {
                obj.Rating = body.Rating;
            }
            if (body.Description != undefined && body.Description != "") {
                obj.Description = body.Description;
            }
            if (query.saloonId) {
                obj.saloonId = query.saloonId;
            }
            if (user) {
                obj.userId = user._id;
            }
            obj.Date = new Date();

            const reviewDetail = new review(obj);
            const result = await reviewDetail.save();
            if (result) {
                return {
                    statusCode: 200,
                    status: true,
                    message: `your review submited successfull !`,
                    data: [result]
                };
            };
        };
    } catch (error) {
        console.log(error);
        throw error;
    };
};

exports.getReviews = async ({ query }) => {
    try {
        const result = await getreviews(query);
        if (result.status) {
            return {
                statusCode: 200,
                status: true,
                message: "review  get successfull !",
                data: result.data
            };
        };
    } catch (error) {
        console.log(error);
        throw error;
    };
};

