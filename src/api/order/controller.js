const cart = require("../cart/model");
const order = require("./model");
const Schedule = require("../Schedule/model");

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
        const orderdetails = new order(obj);
        const result = await orderdetails.save();
        if (result) {
            const deletcart = await cart.findOneAndRemove({ userId });
            if (deletcart) {
                return {
                    statusCode: 200,
                    status: true,
                    message: "order  Succesfuuly !",
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
        let condition = {};
        if (query.id) {
            let _id = query.id;
            condition._id = _id;
        } else {
            let userId = user._id;
            condition.userId = userId;
        };
        const findData = await order.find(condition);
        if (findData.length > 0) {
            return {
                statusCode: 200,
                status: true,
                message: "Find Your Order  Succesfuuly Done !",
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
