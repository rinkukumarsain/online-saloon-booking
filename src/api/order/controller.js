const cart = require("../cart/model");
const order = require("./model");
const Schedule = require("../Schedule/model");
const mongoose = require("mongoose")
const saloon = require("../saloonstore/model")
const { addcart } = require("../cart/controller")

exports.userOrder = async ({ user }) => {
    try {
        let userId;
        let obj = {};
        if (user._id) {
            userId = user._id;
            const findcart = await cart.findOne({ userId });
            if (findcart) {
                obj.addressId = findcart.addressId;
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
            const findSchedule = await Schedule.findOne({ userId });
            if (findSchedule) {
                obj.ScheduleId = findcart._id;
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
        const orderdetails = new order(obj);
        const result = await orderdetails.save();
        if (result) {
            const deletcart = await cart.findOneAndRemove({ userId });
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
        console.log("error", error)
    };
};

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
                'ScheduleId': 1,
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
                        timePeriod_in_minits:
                            "$timePeriod_in_minits",
                        totalamount: "$totalamount",
                        addressId: "$addressId",
                        ScheduleId: "$ScheduleId",
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
                data: 1,
            }
        })


        const findData = await order.aggregate(condition);
        const findAllSaloon = await saloon.find()

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
};

exports.orderCancel = async (req) => {
    try {
        if (req.query.id) {
            const _id = mongoose.Types.ObjectId(req.query.id);
            const findOrder = await order.findOne({ _id });
            if (findOrder) {
                const orderCencal = await order.findByIdAndUpdate({ _id }, { status: "cancel" }, { new: true })
                if (orderCencal) {
                    return {
                        statusCode: 200,
                        status: true,
                        message: `censal order successful `,
                        data: [orderCencal]
                    };
                };
            } else {
                return {
                    statusCode: 400,
                    status: false,
                    message: `Enter valid order id`,
                    data: []
                };
            }
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


