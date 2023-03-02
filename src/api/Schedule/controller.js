const saloonservice = require("../saloonService/model");
const mongoose = require("mongoose");
const cart = require("../cart/model");
const schedule = require("./model");

exports.scheduleYourVisit = async ({ body, user }) => {
    try {
        let findcart = await cart.findOne({ userId: user._id });
        if (findcart) {
            let findSchedul = await schedule.findOne({ cartId: findcart._id });
            if (!findSchedul) {
                let obj = {};
                if (findcart._id) {
                    obj.cartId = findcart._id
                };
                if (findcart.userId) {
                    obj.userId = findcart.userId;
                };

                if (findcart.saloonId) {
                    obj.saloonId = findcart.saloonId;
                };

                if (body.date) {
                    obj.date = body.date;
                };

                if (body.timeslot) {
                    obj.timeslot = body.timeslot;
                };

                let scheduleCart = new schedule(obj);
                const result = await scheduleCart.save();
                if (result) {
                    return {
                        statusCode: 200,
                        status: true,
                        message: "scheduleCart-Succesfuuly !",
                        data: [result]
                    };
                };
            } else {
                return {
                    statusCode: 200,
                    status: true,
                    message: "Allready scheduleCart-added-click-to chakeOut!",
                    data: [findSchedul]
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
        throw error;
    };
};





