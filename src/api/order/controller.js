const cart = require("../cart/model");
const order = require("./model");
const Schedule = require("../Schedule/model");
const mongoose = require("mongoose")

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
        })
        const findData = await order.aggregate(condition);
        if (findData.length > 0) {
            return {
                statusCode: 200,
                status: true,
                message: "Find Your Order  successful Done !",
                data: [findData]
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
        throw error;
    };
};



