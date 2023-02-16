const saloonservice = require("../saloonService/model")
const mongoose = require("mongoose");
const cart = require("../cart/model")
const schedule = require("./model")



exports.scheduleYourVisit = async ({ body, user }) => {
    // console.log("udr", user);
    let obj = {};
    const findcart = await cart.findOne({ userId: user._id })
    // console.log("findcart", findcart)
    if (findcart._id) {
        obj.cartId = findcart._id
    }
    if (findcart.userId) {
        obj.userId = findcart.userId
    }

    if (findcart.saloonId) {
        obj.saloonId = findcart.saloonId
    }

    if (body.date) {
        obj.date = body.date
    }

    if (body.timeslot) {
        obj.timeslot = body.timeslot
    }


    // console.log("obj", obj);
    let scheduleCart = new schedule(obj);
    const result = await scheduleCart.save();
    if (result) {
        return {
            statusCode: 200,
            status: true,
            message: "scheduleCart-Succesfuuly !",
            data: [result]
        };
    }

    /*
    cart ki id and date and time
    user ki id
    */
}





