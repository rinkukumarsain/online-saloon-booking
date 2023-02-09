const { Router } = require("express");
const responseHandler = require("../../utils/responseHandlers")
const { register, otpSent, otpVerify,
    emailLogin, loginOtpVerify, otplogin } = require('./controller');
const app = Router();

app.post("/otp-sent", responseHandler(otpSent));
app.post("/otp-verify", responseHandler(otpVerify));
app.post("/register", responseHandler(register));
app.post("/otp-login", responseHandler(otplogin));

app.post("/email-Login", responseHandler(emailLogin));
app.post("/login-otp-verify", responseHandler(loginOtpVerify))



module.exports = app