const saloonservice = require("../saloonService/model");
const mongoose = require("mongoose");
const cart = require("../cart/model");
const schedule = require("./model");
const order = require("../order/model");
const saloon = require("../saloonstore/model");
const moment = require("moment");

exports.scheduleYourVisit = async ({ query, body, user }) => {
    try {
        if (!query.saloonId) {
            return {
                statusCode: 400,
                status: false,
                message: "saloonId is must !",
                data: []
            };
        };

        let findcart = await cart.findOne({ saloonId: mongoose.Types.ObjectId(query.saloonId), userId: user._id });
        if (findcart.cartdata.length > 0) {
            let findSchedul = await schedule.findOne({ cartId: findcart._id, saloonId: findcart.saloonId });
            let OrderDay = moment(body.date).format('dddd');
            const findSaloon = await saloon.findOne({ _id: mongoose.Types.ObjectId(query.saloonId) });
            if (findSaloon.ProfileInfo.workingday.includes(OrderDay) === false) {
                return {
                    statusCode: 400,
                    status: false,
                    message: `saloon-is-close-this-Date ${body.date}!`,
                    data: findSaloon.ProfileInfo.workingday
                };
            };

            const findUserOrder = await order.find({ userId: user._id, status: "pending" });
            for (const element of findUserOrder) {
                if (element.Schedule.date == body.date) {
                    if (element.Schedule.timeslot == body.timeslot) {
                        return {
                            statusCode: 400,
                            status: false,
                            message: `user-Allready-take-order-this-Date ${body.date}!`,
                            data: [element]
                        };
                    };
                };
            };

            if (!findSchedul) {
                if (findcart._id) {
                    body.cartId = findcart._id
                };
                if (findcart.userId) {
                    body.userId = findcart.userId;
                };

                if (findcart.saloonId) {
                    body.saloonId = findcart.saloonId;
                };

                let scheduleCart = new schedule(body);
                const result = await scheduleCart.save();
                if (result) {
                    return {
                        statusCode: 200,
                        status: true,
                        message: "schedule-Succesfuuly !",
                        data: [result]
                    };
                };
            } else {
                let obj = {};
                if (body.date) {
                    obj.date = body.date;
                };
                if (body.timeslot) {
                    obj.timeslot = body.timeslot;
                };
                const result = await schedule.findByIdAndUpdate({ _id: findSchedul._id }, { $set: obj }, { new: true })
                if (result) {
                    return {
                        statusCode: 200,
                        status: true,
                        message: "schedule updated Succesfuuly",
                        data: [result]
                    };
                };
            };
        } else {
            return {
                statusCode: 400,
                status: false,
                message: "Your Cart in empty!",
                data: []
            };
        };
    } catch (error) {
        console.log(error);
    };
};
