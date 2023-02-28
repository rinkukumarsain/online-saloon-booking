const users = require("../user/model");
const servish = require("../saloonService/model");
const razorpay = require("razorpay");



exports.payment = async (req, res) => {
    console.log("razorpay")
    let { amount } = req.body;
    var instance = new razorpay({ key_id: 'rzp_test_NkfVhSnelzPIaS', key_secret: 'r6sc85e2rB6m3groHIs9OiQx' });
    let order = await instance.orders.create({
        amount: 100 * 100,
        currency: 'INR',
        receipt: uniqid()
    })
    console.log("order", order)
    res.status(201).json({
        success: true,
        order,
        amount,
    });
};