const users = require("../user/model");
const servish = require("../saloonService/model");
const razorpay = require("razorpay");
const payments = require("./model");
const { findOne, findOneAndUpdate } = require("./model");

var instance = new razorpay({
    key_id: process.env.key_id,
    key_secret: process.env.key_secret
});
//backEnd

exports.createOrderId = async (req) => {
    try {
        let { amount } = req.body;
        let userId;
        var options = {
            amount: amount * 100,
            currency: "INR",
            receipt: "rc_1"
        };
        const order = await instance.orders.create(options)
        if (order) {
            if (req.user) {
                userId = req.user._id
            } else {
                userId = null
            }
            const paymentDitail = new payments({
                userId: userId,
                orderData: {
                    id: order.id,
                    entity: order.entity,
                    amount: order.amount,
                    amount_paid: order.amount_paid,
                    amount_due: order.amount_due,
                    currency: order.currency,
                    receipt: order.receipt,
                    offer_id: order.offer_id,
                    status: order.status,
                    attempts: order.attempts,
                    notes: order.notes,
                    created_at: order.created_at,
                }
            });
            const result = await paymentDitail.save();
            if (result) {
                return {
                    statusCode: 200,
                    status: true,
                    message: "User orderid created  successfull !",
                    data: [result]
                }
            };
        };
    } catch (error) {
        console.log("error--", error);
        throw error;
    };
};
//front End

/*
exports.createOrderId = async (req, res) => {
    try {
        let { amount } = req.body;
        let userId;
        var options = {
            amount: amount * 100,
            currency: "INR",
            receipt: "rc_1"
        };

        instance.orders.create(options, async function (err, order) {
            if (order) {
                if (req.user) {
                    userId = req.user._id
                } else {
                    userId = null
                }
                const paymentDitail = new payments({
                    userId: userId,
                    orderData: {
                        id: order.id,
                        entity: order.entity,
                        amount: order.amount,
                        amount_paid: order.amount_paid,
                        amount_due: order.amount_due,
                        currency: order.currency,
                        receipt: order.receipt,
                        offer_id: order.offer_id,
                        status: order.status,
                        attempts: order.attempts,
                        notes: order.notes,
                        created_at: order.created_at,
                    }
                });
                const result = await paymentDitail.save();
                if (result) {
                    // return {
                    //     orderId: order.id
                    // }
                    res.send({
                        orderId: order.id
                    });
                };
            };
        });
    } catch (error) {
        console.log("error--", error);
        throw error;
    };
};

*/
//front End 
/*
exports.apiPaymentVerify = async (req, res) => {
    try {
        let body = req.body.response.razorpay_order_id + "|" + req.body.response.razorpay_payment_id;
        console.log("body", body)
        var crypto = require("crypto");
        var expectedSignature = crypto.createHmac('sha256',  process.env.key_secret)
            .update(body.toString())
            .digest('hex');
        console.log("sig received ", req.body.response.razorpay_signature);
        console.log("sig generated ", expectedSignature);
        var response = { "signatureIsValid": "false" };
        if (expectedSignature === req.body.response.razorpay_signature) {
            const result = await payments.findOneAndUpdate({ "orderData.id": req.body.response.razorpay_order_id }, { payment: "Payment successfull" }, { new: true });
            if (result) {
                response = { "signatureIsValid": "true" };
                res.send(response);
            };
        };
    } catch (error) {
        console.log("error--", error);
        throw error;
    };
};
*/
//backEnd

exports.apiPaymentVerify = async (req, res) => {
    try {
        let body = req.body.response.razorpay_order_id + "|" + req.body.response.razorpay_payment_id;
        console.log("body", body)
        var crypto = require("crypto");
        var expectedSignature = crypto.createHmac('sha256', process.env.key_secret)
            .update(body.toString())
            .digest('hex');
        console.log("sig received ", req.body.response.razorpay_signature);
        console.log("sig generated ", expectedSignature);
        var response = { "signatureIsValid": "false" };
        if (expectedSignature === req.body.response.razorpay_signature) {
            const result = await payments.findOneAndUpdate({ "orderData.id": req.body.response.razorpay_order_id }, { payment: "Payment successfull" }, { new: true });
            if (result) {
                console.log("result", result)
                response = { "signatureIsValid": "true" };
                return {
                    statusCode: 200,
                    status: true,
                    message: "User orderid signature successfull !",
                    data: [response]
                }
            };
        };
    } catch (error) {
        console.log("error--", error);
        throw error;
    };
};


