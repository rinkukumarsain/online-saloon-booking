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
    };
};

exports.getReviews = async ({ query, user }) => {
    try {
        query.user = user
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
    };
};


exports.updateLikeDislike = async ({ user, query }) => {
    try {
        if (query.id != undefined && query.id != "") {
            let obj = {};
            let like = []
            const _id = mongoose.Types.ObjectId(query.id)
            const findData = await review.findOne({ _id })
            if (findData) {
                //dislike me hai to remove aur like me add 
                if (query.like != undefined && query.like != "") {
                    const opchake = findData.dislike.includes(user._id)
                    if (opchake) {
                        var idx = findData.dislike.indexOf(user._id);
                        if (idx != -1) {
                            const rrr = findData.dislike.splice(idx, 1);
                            obj.dislike = findData.dislike
                        }
                    }
                    if (findData.like.length > 0) {
                        const chake = findData.like.includes(user._id);
                        if (chake) {
                            return {
                                statusCode: 400,
                                status: false,
                                message: "you are allredy like this   !",
                                data: [findData]
                            };
                        } else {
                            let arr = []
                            findData.like.forEach(element => {
                                arr.push(element)
                            });

                            arr.push(user._id)
                            obj.like = arr
                        }
                    } else {
                        like.push(user._id)
                        obj.like = like
                    }
                }


                let dislike = []
                if (query.dislike != undefined && query.dislike != "") {
                    const opchake = findData.like.includes(user._id)
                    if (opchake) {
                        var idx = findData.like.indexOf(user._id);
                        if (idx != -1) {
                            findData.like.splice(idx, 1);
                            obj.like = findData.like
                        }

                    }

                    if (findData.dislike.length > 0) {
                        const chake = findData.dislike.includes(user._id);
                        if (chake) {
                            return {
                                statusCode: 400,
                                status: false,
                                message: "you are allredy dislike this   !",
                                data: [findData]
                            };
                        } else {
                            let arr = []
                            findData.dislike.forEach(element => {
                                arr.push(element)
                            });

                            arr.push(user._id)
                            obj.dislike = arr
                        }
                    } else {
                        dislike.push(user._id)
                        obj.dislike = dislike
                    }
                }


                const update = await review.findByIdAndUpdate({ _id }, obj, { new: true })
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
    } catch (error) {
        console.log(error);
    };
}
