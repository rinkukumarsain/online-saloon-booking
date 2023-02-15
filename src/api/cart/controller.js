const saloonservice = require("../saloonService/model")
const mongoose = require("mongoose");
const cart = require("./model")

exports.cartRegistration = async ({ body, user, quiry }) => {
    let obj = {};
    let arr = [];
    let totalamount = []
    obj.userId = user._id
    if (body.saloonId) {
        obj.saloonId = mongoose.Types.ObjectId(body.saloonId);
    }
    if (body.cartData.length > 0) {
        for await (const item of body.cartData) {
            let cartdata = {}
            let _id = item.serviceId
            const finddata = await saloonservice.findOne({ _id: item.serviceId })
            cartdata.serviceId = finddata._id
            cartdata.quantity = item.quantity
            cartdata.Amount = item.quantity * finddata.ServicePrice
            cartdata.timePeriod_in_minits = finddata.timePeriod_in_minits
            arr.push(cartdata)
            totalamount.push(cartdata.Amount)
        };
        obj.cartdata = arr
    }
    const sum = totalamount.reduce(add, 0);
    function add(accumulator, a) {
        return accumulator + a;
    }
    obj.totalamount = sum

    let cart_detail = new cart(obj);
    const result = await cart_detail.save();
    if (result) {
        return {
            statusCode: 200,
            status: true,
            message: "User-Cart-register- Succesfuuly !",
            data: [result]
        };
    }
}
