const { Router } = require("express");
const responseHandler = require("../../utils/responseHandlers");
const auth = require("../../middleware/auth");
const { createOrderId, apiPaymentVerify } = require('./controller');
const razorpay = require("razorpay");
const app = Router();

app.post('/create/orderId', auth, responseHandler(createOrderId));
app.post('/api/payment/verify', auth, responseHandler(apiPaymentVerify));


module.exports = app;