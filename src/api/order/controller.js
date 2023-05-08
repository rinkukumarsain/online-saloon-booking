const cart = require("../cart/model");
const order = require("./model");
const Schedule = require("../Schedule/model");
const mongoose = require("mongoose")
const saloon = require("../saloonstore/model")
const { addcart } = require("../cart/controller");
const { query } = require("express");
const coupon = require("../coupon/model")

exports.userOrder = async ({ query, user }) => {
    try {
        let userId;
        let obj = {};
        if (user._id) {
            userId = user._id;
            const findcart = await cart.findOne({ _id: mongoose.Types.ObjectId(query.cartId), userId });
            if (findcart) {
                if (findcart.addressId != undefined) {
                    obj.addressId = findcart.addressId;
                }
                obj.saloonId = findcart.saloonId;
                obj.cartdata = findcart.cartdata;
                obj.totalamount = findcart.totalamount;
            } else {
                return {
                    statusCode: 400,
                    status: false,
                    message: "Your Cart Is Empty !",
                    data: []
                };
            };
            if (query.PaymentId != undefined && query.PaymentId != "") {
                obj.PaymentId = query.PaymentId
            } else {
                return {
                    statusCode: 400,
                    status: false,
                    message: "PaymentId is must !",
                    data: []
                };
            }
            const findSchedule = await Schedule.findOne({ userId });
            if (findSchedule) {
                let Schedule = {}
                Schedule.date = findSchedule.date
                Schedule.timeslot = findSchedule.timeslot
                obj.Schedule = Schedule;

            } else {
                return {
                    statusCode: 400,
                    status: false,
                    message: "Please Choice is Time And Date !",
                    data: []
                };
            };
        };
        let orderId = Math.floor(Math.random() * 10 ** 15);
        obj.userId = userId;
        obj.orderId = orderId;
        // obj.paymentStatus = "Payment successful"
        if (query.couponId != undefined && query.couponId != "") {
            const findCoupon = await coupon.findOne({ _id: mongoose.Types.ObjectId(query.couponId) })
            obj.couponId = findCoupon._id;
            obj.Discount = findCoupon.Discount
            obj.finalTotalAmount = obj.totalamount - findCoupon.Discount
        }
        const orderdetails = new order(obj);
        const result = await orderdetails.save();
        if (result) {
            const deletcart = await cart.findOneAndRemove({ _id: mongoose.Types.ObjectId(query.cartId), userId });
            const findSchedule = await Schedule.findOneAndRemove({ userId });
            if (deletcart && findSchedule) {
                return {
                    statusCode: 200,
                    status: true,
                    message: "order  successful !",
                    data: [result]
                };
            };
        };
    } catch (error) {
        console.log(error)
    };
};

/*
exports.getUserOrder = async ({ user, query }) => {
    try {
        let condition = [];
        let finalData = [];
        if (query.id) {
            condition.push({
                '$match': {
                    '_id': mongoose.Types.ObjectId(query.id)
                }
            })
        } else {
            // let userId = user._id;
            // condition.userId = userId;
            condition.push({
                '$match': {
                    'userId': user._id
                    // 'userId': mongoose.Types.ObjectId("63edcfe963019ceacb729327")
                }
            })
        };
        condition.push({
            '$unwind': {
                'path': '$cartdata'
            }
        }, {
            '$lookup': {
                'from': 'saloonservices',
                'localField': 'cartdata.serviceId',
                'foreignField': '_id',
                'as': 'result'
            }
        }, {
            '$unwind': {
                'path': '$result'
            }
        }, {
            '$project': {
                'userId': 1,
                'saloonId': 1,
                'ServiceName': '$result.ServiceName',
                'ServicePrice': '$result.ServicePrice',
                'timePeriod_in_minits': '$result.timePeriod_in_minits',
                'totalamount': 1,
                'addressId': 1,
                'Schedule': 1,
                'paymentStatus': 1,
                'status': 1,
                'orderId': 1,
                'createdAt': 1,
                'updatedAt': 1
            }

        }, {
            "$group": {
                _id: "$_id",
                data: {
                    $push: {
                        _id: "$_id",
                        userId: "$userId",
                        saloonId: "$saloonId",
                        ServiceName: "$ServiceName",
                        ServicePrice: "$ServicePrice",
                        timePeriod_in_minits: "$timePeriod_in_minits",
                        totalamount: "$totalamount",
                        addressId: "$addressId",
                        Schedule: "$Schedule",
                        paymentStatus: "$paymentStatus",
                        status: "$status",
                        orderId: "$orderId",
                        createdAt: "$createdAt",
                        updatedAt: "$updatedAt",
                    },
                },
            }
        }, {
            "$project": {
                _id: 0,
                saloonId: {
                    $arrayElemAt: ["$data.saloonId", 0],
                },
                addressId: {
                    $arrayElemAt: ["$data.addressId", 0],
                },
                data: 1,
            }
        }, {
            '$unset': 'data.saloonId'
        }, {
            '$unset': 'data.addressId'
        })


        const findData = await order.aggregate(condition);
        const findAllSaloon = await saloon.find()
        // const findAllSaloon = await saloon.find({}, { image: 1, storeName: 1, location: 1 })

        for (const order of findData) {
            for (const Saloon of findAllSaloon) {
                if (order.saloonId.toString() === Saloon._id.toString()) {
                    Saloon._doc.item = order
                    finalData.push(Saloon)
                };
            };
        };

        if (finalData.length > 0) {
            return {
                statusCode: 200,
                status: true,
                message: "Find Your Order  successful Done !",
                data: [finalData]
            };
        } else {
            return {
                statusCode: 400,
                status: false,
                message: "Not Find Your Order !",
                data: []
            };
        };
    } catch (error) {
        console.log(error);
    };
};*/


// new code 
exports.getUserOrder = async ({ user, query }) => {
    try {
        let condition = [];
        let finalData = [];
        if (query.id) {
            condition.push({
                '$match': {
                    '_id': mongoose.Types.ObjectId(query.id)
                }
            })
        } else {
            condition.push({
                '$match': {
                    'userId': user._id
                }
            })
        };

        condition.push({
            '$unwind': {
                'path': '$cartdata'
            }
        }, {
            '$lookup': {
                'from': 'saloonservices',
                'localField': 'cartdata.serviceId',
                'foreignField': '_id',
                'as': 'cartdata'
            }
        }, {
            '$unwind': {
                'path': '$cartdata'
            }
        }, {
            '$lookup': {
                'from': 'saloons',
                'localField': 'saloonId',
                'foreignField': '_id',
                'pipeline': [
                    {
                        '$project': {
                            'storeName': 1,
                            'image': 1,
                            'location': 1
                        }
                    }
                ],
                'as': 'saloon'
            }
        }, {
            '$unwind': {
                'path': '$saloon'
            }
        }, {
            '$group': {
                '_id': '$_id',
                'saloon': {
                    '$first': {
                        '_id': '$saloon._id',
                        'storeName': '$saloon.storeName',
                        'image': '$saloon.image',
                        'location': '$saloon.location'
                    }
                },
                'services': {
                    '$push': {
                        '_id': '$cartdata._id',
                        'ServiceName': '$cartdata.ServiceName',
                        'ServicePrice': '$cartdata.ServicePrice'
                    }
                },
                'orderDetail': {
                    '$first': {
                        '_id': '$_id',
                        'Schedule': '$Schedule',
                        'totalamount': '$totalamount',
                        'couponId': '$couponId',
                        'paymentStatus': '$paymentStatus',
                        'status': '$status',
                        'orderId': '$orderId',
                        'addressId': '$addressId',
                        'createdAt': '$createdAt'
                    }
                }
            }
        }, {
            '$sort': {
                'orderDetail.createdAt': -1
            }
        })

        const findData = await order.aggregate(condition);

        if (findData.length > 0) {
            return {
                statusCode: 200,
                status: true,
                message: "Find Your Order  successful Done !",
                data: findData
            };
        } else {
            return {
                statusCode: 400,
                status: false,
                message: "Not Find Your Order !",
                data: []
            };
        };
    } catch (error) {
        console.log(error);
    };
};
const { paymentsRefund } = require("../payment/controller")
exports.orderCancel = async (req) => {
    try {
        if (req.query.id) {
            const _id = mongoose.Types.ObjectId(req.query.id);
            const findOrder = await order.findOne({ _id, status: { $ne: "succes" } });
            if (findOrder) {
                const updateData = await order.findByIdAndUpdate({ _id }, { status: "cancel" }, { new: true })
                if (updateData) {
                    // refund paise 
                    req.query._id = updateData.PaymentId
                    const paymentRefund = await paymentsRefund(req)
                    // refund paise successfull
                    if (paymentRefund) {
                        return {
                            statusCode: 200,
                            status: true,
                            message: `cancel order successfull && payment refunded`,
                            data: [updateData]
                        };
                    };
                };
            } else {
                return {
                    statusCode: 400,
                    status: false,
                    message: `Enter valid pending  order id`,
                    data: []
                };
            };
        } else {
            return {
                statusCode: 400,
                status: false,
                message: `Enter a order id`,
                data: []
            };
        }
    } catch (error) {
        console.log(error);
    };
};


