const review = require("./model")
const mongoose = require("mongoose")

exports.getreviews = async (query) => {
    try {
        const saloonId = mongoose.Types.ObjectId(query.saloonId);
        const condition = [];
        condition.push({
            '$match': {
                'saloonId': saloonId
            }
        });
        condition.push({
            '$lookup': {
                'from': 'users',
                'localField': 'userId',
                'foreignField': '_id',
                'pipeline': [
                    {
                        '$project': {
                            'name': 1,
                            'image': 1,
                        }
                    }
                ],
                'as': 'user'
            }
        }, {
            '$unwind': {
                'path': '$user'
            }
        });
        const findData = await review.aggregate(condition);
        if (findData) {
            return {
                statusCode: 200,
                status: true,
                message: "reviews  find successfull !",
                data: findData
            };
        }
    } catch (error) {
        console.log(error);
        throw error;
    };
};