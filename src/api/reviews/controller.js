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
        if (result.status === true) {
            return {
                statusCode: 200,
                status: true,
                message: "review  get successfull !",
                data: result.data
            };
        } else {
            return {
                statusCode: 400,
                status: false,
                message: "reviews  not find  !",
                data: []
            };
        }
    } catch (error) {
        console.log(error);
        throw error;
    };
};


exports.updateLikeDislike = async ({ user, query }) => {
    if (query.id != undefined && query.id != "") {
        let obj = {};
        like = []
        const _id = mongoose.Types.ObjectId(query.id)
        const findData = await review.findOne({ _id })
        if (findData) {
            if (query.like != undefined && query.like != "") {
                if (findData.like.length > 0) {
                    console.log("findData-like-->", findData.like)
                    const chake = findData.like.includes(user._id);
                    if (chake) {
                        return {
                            statusCode: 400,
                            status: false,
                            message: "you are allredy like this   !",
                            data: []
                        };
                    } else {
                        like.push(user._id)
                        let spebhb = [findData.like, ...like]
                        console.log("spebhb", spebhb)
                        jhgh
                        obj.like = [findData.like, ...like]
                    }
                    hgfgv
                } else {
                    like.push(user._id)
                    obj.like = like
                }
            }


            if (query.dislike != undefined && query.dislike != "") {
                obj.dislike = user._id
            }
            console.log("obbj", obj)
            const update = await review.findByIdAndUpdate({ _id }, obj, { new: true })
            console.log("update", update)
            if (update) {
                return {
                    statusCode: 200,
                    status: true,
                    message: "updateed   !",
                    data: [update]
                };
            }
        } else {
            return {
                statusCode: 400,
                status: false,
                message: "Enter a valid reviews Id find  !",
                data: []
            };
        }
    } else {
        return {
            statusCode: 400,
            status: false,
            message: "Enter a reviews Id find  !",
            data: []
        };
    }

}
