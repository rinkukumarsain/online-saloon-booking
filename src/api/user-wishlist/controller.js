const cart = require("../cart/model");
const order = require("./model");
const Schedule = require("../Schedule/model");
const saloon = require("../saloonstore/model")
const wishlist = require("./model");
const mongoose = require("mongoose");

exports.userWishlist = async ({ user, query }) => {
    try {
        if (query.id) {
            let _id = mongoose.Types.ObjectId(query.id);
            const findSaloon = await saloon.findOne({ _id });
            if (findSaloon) {
                const findWishlist = await wishlist.findOne({ saloonId: _id });
                if (findWishlist) {
                    return {
                        statusCode: 400,
                        status: false,
                        message: "This-is-allready-in-wishlist !",
                        data: []
                    };
                } else {
                    const wishlistDitail = new wishlist({
                        userId: user._id,
                        saloonId: findSaloon._id
                    });
                    const result = await wishlistDitail.save();
                    if (result) {
                        return {
                            statusCode: 200,
                            status: true,
                            message: "wishlist added Succesfuuly !",
                            data: [result]
                        };
                    };
                };
            } else {
                return {
                    statusCode: 400,
                    status: false,
                    message: "please Enter A valide saloon store id !",
                    data: []
                };
            };
        } else {
            return {
                statusCode: 400,
                status: false,
                message: "please Enter A saloon store id !",
                data: []
            };
        };
    } catch (error) {
        console.log(error);
        
    };
};


exports.getWishlist = async ({ user, query }) => {
    try {
        let condition = [];
        if (query.id) {
            condition.push({
                '$match': {
                    '$and': [
                        {
                            'saloonId': mongoose.Types.ObjectId(query.id)
                        },
                        {
                            'userId': user._id
                        },
                    ]
                }
            });
        } else {
            condition.push({
                '$match': {
                    'userId': user._id
                }
            });
        };

        condition.push({
            '$lookup': {
                'from': 'saloons',
                'localField': 'saloonId',
                'foreignField': '_id',
                'as': 'result'
            }
        });

        condition.push({
            '$unwind': {
                'path': '$result'
            }
        });

        condition.push({
            '$project': {
                'userId': 1,
                'saloonId': 1,
                'saloonOwn': '$result.userId',
                'storeName': '$result.storeName',
                'Email': '$result.Email',
                'PhoneNumber': '$result.PhoneNumber',
                'image': '$result.image',
                'location': '$result.location',
                'description': '$result.description'
            }
        });

        const finddata = await wishlist.aggregate(condition);
        // console.log("finddata", finddata)
        if (finddata.length > 0) {
            return {
                statusCode: 200,
                status: true,
                message: "your wish list is hare !",
                data: finddata
            };
        } else {
            return {
                statusCode: 200,
                status: false,
                message: "please Enter valid store id  !",
                data: []
            };
        };
    } catch (error) {
        console.log(error);
        
    };
};

exports.removeStoreFromWishlist = async ({ query }) => {
    try {
        if (query.id) {
            let saloonId = mongoose.Types.ObjectId(query.id);
            const findSaloon = await wishlist.findOne({ saloonId });
            if (findSaloon) {
                const result = await wishlist.findByIdAndRemove({ _id: findSaloon._id });
                if (result) {
                    return {
                        statusCode: 200,
                        status: true,
                        message: "remove Succesfuuly  !",
                        data: [result]
                    };
                };
            } else {
                return {
                    statusCode: 400,
                    status: false,
                    message: "please Enter valid store id  !",
                    data: []
                };
            };
        } else {
            return {
                statusCode: 400,
                status: false,
                message: "please Enter store id  !",
                data: []
            };
        };
    } catch (error) {
        console.log(error);
        
    };
};


