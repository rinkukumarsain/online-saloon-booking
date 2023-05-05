const { default: mongoose } = require("mongoose");
const user = require("../../api/user/model");

exports.allUser = async (req, res) => {
    try {
        let serchobj = {};
        if (req.query.name != undefined && req.query.name != "") {
            serchobj.name = { $regex: req.query.name, $options: "i" };
        }

        if (req.query.referId != undefined && req.query.referId != "") {
            serchobj.referId = mongoose.Types.ObjectId(req.query.referId)
        }

        if (req.query.email != undefined && req.query.email != "") {
            serchobj.email = { $regex: req.query.email, $options: "i" };
        }

        if (req.query.mobile != undefined && req.query.mobile != "") {
            serchobj.phone = { $regex: req.query.mobile, $options: "i" };
        }

        if (req.query.gender != undefined && req.query.gender != "") {
            serchobj.gender = req.query.gender
        }

        if (req.query.status != undefined && req.query.status != "") {
            serchobj.type = req.query.status;
        }

        const Finddata = await user.aggregate([
            { '$match': serchobj }, {
                '$lookup': {
                    'from': 'orders',
                    'localField': '_id',
                    'foreignField': 'userId',
                    'as': 'result'
                }
            }, {

                '$lookup': {
                    from: "users",
                    localField: "_id",
                    foreignField: "referId",
                    as: "referUser"
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
                    'type': 1,
                    'userWallet': 1,
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
                    }, 'numberOfreferel': {
                        '$cond': {
                            'if': {
                                '$isArray': "$referUser",
                            },
                            'then': {
                                '$size': "$referUser",
                            },
                            'else': "NA",
                        },
                    },
                }
            }
        ]);

        return {
            statusCode: 200,
            status: true,
            message: "address-is already in database !",
            data: Finddata,
        };
    } catch (error) {
        console.log(error);
    };
};


