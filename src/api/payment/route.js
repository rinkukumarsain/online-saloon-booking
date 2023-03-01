const { Router } = require("express");
const responseHandler = require("../../utils/responseHandlers");
const auth = require("../../middleware/auth");
const { createOrderId, apiPaymentVerify } = require('./controller');
const razorpay = require("razorpay");
const app = Router();

app.get("/pay", (req, res) => {
    res.render("payment");
});
//back End
app.post('/create/orderId', responseHandler(createOrderId));
///front end
// app.post('/create/orderId', createOrderId);
// backEnd
app.post('/api/payment/verify', responseHandler(apiPaymentVerify));
// frontend
// app.post('/api/payment/verify', apiPaymentVerify);


module.exports = app;