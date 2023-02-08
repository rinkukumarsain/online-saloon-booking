const { Router } = require("express");
const responseHandler = require("../../utils/responseHandlers")
const { register, otpSent, otpVerify } =require('./controller');
const app = Router();

app.post("/otp-sent", responseHandler(otpSent));
app.post("/otp-verify",responseHandler(otpVerify));
app.post("/register",responseHandler(register));

module.exports = app