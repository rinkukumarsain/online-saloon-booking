const { default: mongoose } = require("mongoose");
const order = require("../../api/order/model")


exports.getAllOrder = async (req) => {
    try {
        let match = {}
        let condition = [];
        if (req.query.userId != undefined && req.query.userId != "") {
            match.userId = mongoose.Types.ObjectId(req.query.userId)
        }
        if (req.query.orderId != undefined && req.query.orderId != "") {
            match._id = mongoose.Types.ObjectId(req.query.orderId)
        }
        if (req.query.status != undefined && req.query.status != "") {
            match.status = req.query.status
        }

        if (req.query.totalamount != undefined && req.query.totalamount != "") {
            match.totalamount = { $gt: Number(req.query.totalamount) }
        } else {
            match.totalamount = { $gt: 0 }
        }

        if (match.totalamount != undefined || match.status != undefined) {
            condition.push({
                '$match': match
            })
        }
        if (req.user.type == "admin") {
            condition.push({
                '$lookup': {
                    'from': 'saloons',
                    'localField': 'saloonId',
                    'foreignField': '_id',
                    'pipeline': [
                        {
                            '$match': {
                                'userId': req.user._id
                            }
                        }
                    ],
                    'as': 'saloon'
                }
            })
        } else {
            condition.push({
                '$lookup': {
                    'from': 'saloons',
                    'localField': 'saloonId',
                    'foreignField': '_id',
                    'as': 'saloon'
                }
            })
        }

        condition.push({
            '$lookup': {
                'from': 'users',
                'localField': 'userId',
                'foreignField': '_id',
                'pipeline': [
                    {
                        '$project': {
                            'name': 1,
                            'phone': 1,
                            'email': 1
                        }
                    }
                ],
                'as': 'users'
            }
        })

        condition.push({
            '$unwind': {
                'path': '$users',
                'preserveNullAndEmptyArrays': true
            }
        }, {
            '$unwind': {
                'path': '$saloon',
                'preserveNullAndEmptyArrays': true
            }
        })

        condition.push({
            '$lookup': {
                'from': 'payments',
                'localField': 'PaymentId',
                'foreignField': '_id',
                'as': 'pay'
            }
        }, {
            '$unwind': {
                'path': '$pay',
                'preserveNullAndEmptyArrays': true
            }
        })

        if (req.query.city != undefined && req.query.city != "") {
            condition.push({
                '$match': {
                    'saloon.location.city': req.query.city
                }
            })
        }

        if (req.user.type == "admin") {
            condition.push({
                '$match': {
                    'saloon._id': {
                        '$exists': true
                    }
                }
            })
        }

        const data = await order.aggregate(condition)
        if (data.length > 0) {
            return {
                statusCode: 200,
                status: true,
                message: "order Found  Succesfuuly !",
                data: data,
            };
        } else {
            return {
                statusCode: 400,
                status: false,
                message: "order not Found !",
                data: []
            };
        }
    } catch (error) {
        console.log(error);
    };
};