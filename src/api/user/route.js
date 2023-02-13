const { Router } = require("express");
const responseHandler = require("../../utils/responseHandlers");
const { register, otpSent, otpVerify, login, loginOtpVerify,add_to_cart } = require('./controller');
const app = Router();

app.post("/otp-sent", responseHandler(otpSent));
app.post("/otp-verify", responseHandler(otpVerify));
app.post("/register", responseHandler(register));
// app.post("/otp-login", responseHandler(otplogin));

app.post("/login", responseHandler(login));
app.post("/login-otp-verify", responseHandler(loginOtpVerify));

app.post("/add_to_cart",responseHandler(add_to_cart))



module.exports = app