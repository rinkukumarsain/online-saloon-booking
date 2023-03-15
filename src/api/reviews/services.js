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
        })

        condition.push({
            '$unwind': {
                'path': '$user'
            }
        });
        condition.push({
            '$project': {
                '_id': 1,
                'userId': 1,
                'saloonId': 1,
                'Rating': 1,
                'Date': 1,
                'Description': 1,
                'dislike': {
                    '$cond': {
                        'if': {
                            '$isArray': '$dislike'
                        },
                        'then': {
                            '$size': '$dislike'
                        },
                        'else': 0
                    }
                },
                'like': {
                    '$cond': {
                        'if': {
                            '$isArray': '$like'
                        },
                        'then': {
                            '$size': '$like'
                        },
                        'else': 0
                    }
                },
                'user': 1
            }
        })
        const findData = await review.aggregate(condition);
        if (findData.length > 0) {
            return {
                statusCode: 200,
                status: true,
                message: "reviews  find successfull !",
                data: findData
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