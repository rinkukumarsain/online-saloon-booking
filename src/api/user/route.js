const { Router } = require("express");
const responseHandler = require("../../utils/responseHandlers")
const { register, otpSent, otpVerify, login, loginOtpVerify } = require('./controller');
const app = Router();

app.post("/otp-sent", responseHandler(otpSent));
app.post("/otp-verify", responseHandler(otpVerify));
app.post("/register", responseHandler(register));

app.post("/login", responseHandler(login));
app.post("/login-otp-verify", loginOtpVerify)



module.exports = app