const user = require("../../api/user/model");

exports.allUser = async (req, res) => {
    try {
        const Finddata = await user.aggregate([
            {
                '$lookup': {
                    'from': 'orders',
                    'localField': '_id',
                    'foreignField': 'userId',
                    'as': 'result'
                }
            }, {
                '$project': {
                    'name': 1,
                    'phone': 1,
                    'email': 1,
                    'password': 1,
                    'otp': 1,
                    '__v': 1,
                    'updatedAt': 1,
                    'auth': 1,
                    'image': 1,
                    'dateOfBirth': 1,
                    'gender': 1,
                    'numberOfOrder': {
                        '$cond': {
                            'if': {
                                '$isArray': '$result'
                            },
                            'then': {
                                '$size': '$result'
                            },
                            'else': 'NA'
                        }
                    }
                }
            }
        ]);

        // console.log("Finddata", Finddata)
        return {
            statusCode: 200,
            status: true,
            message: "address-is already in database !",
            data: Finddata
        };
    } catch (error) {
        console.log(error);
    };
};


