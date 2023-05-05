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
            let arr = []
            let sss = []
            if (findSaloon) {
                const findWishlist = await wishlist.findOne({ userId: user._id });

                if (!findWishlist) {
                    arr.push(findSaloon._id)
                    const wishlistDitail = new wishlist({
                        userId: user._id,
                        saloonId: arr
                    });
                    const result = await wishlistDitail.save();
                    if (result) {
                        return {
                            statusCode: 200,
                            status: true,
                            message: "wishlist created Succesfuuly !",
                            data: [result],
                        };
                    };
                } else {
                    findWishlist.saloonId.forEach(element => {
                        arr.push(element.toString())
                    });
                    if (arr.includes(findSaloon._id.toString()) == false) {
                        arr.push(findSaloon._id.toString())
                    } else {
                        let index = arr.indexOf(findSaloon._id.toString())
                        arr.splice(index, 1);
                    }
                    const result = await wishlist.findByIdAndUpdate({ _id: findWishlist._id }, { saloonId: arr }, { new: true })
                    if (result) {
                        return {
                            statusCode: 200,
                            status: true,
                            message: "This-wishlist-update !",
                            data: [result]
                        };
                    }
                }
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

        // condition.push({
        //     '$project': {
        //         'userId': 1,
        //         'saloonId': 1,
        //         'saloonOwn': '$result.userId',
        //         'storeName': '$result.storeName',
        //         'Email': '$result.Email',
        //         'PhoneNumber': '$result.PhoneNumber',
        //         'image': '$result.image',
        //         'location': '$result.location',
        //         'description': '$result.description'
        //     }
        // });

        const finddata = await wishlist.aggregate(condition);
        if (finddata.length > 0) {
            return {
                statusCode: 200,
                status: true,
                message: "your wish list is hare !",
                data: finddata
            };
        } else {
            return {
                statusCode: 400,
                status: false,
                message: "no data found !",
                data: []
            };
        };
    } catch (error) {
        console.log(error);
    };
};

exports.removeStoreFromWishlist = async ({ user, query }) => {
    try {
        if (query.id) {
            let saloonId = mongoose.Types.ObjectId(query.id);
            const findSaloon = await wishlist.findOne({ saloonId, userId: user._id });
            if (findSaloon) {
                const result = await wishlist.findByIdAndRemove({ _id: findSaloon._id });
                if (result) {
                    return {
                        statusCode: 200,
                        status: true,
                        message: "remove Succesfuuly  !",
                        data: [result],
                        wishlist: false
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


