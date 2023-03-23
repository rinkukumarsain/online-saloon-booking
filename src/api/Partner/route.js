const { Router } = require("express");
const responseHandler = require("../../utils/responseHandlers");
const Upload = require("../../middleware/img");
const auth = require("../../middleware/auth");
const { businessSignUp, otpSent, otpVerify } = require('./controller');
const app = Router();

app.post("/business-otp-sent", responseHandler(otpSent));
app.post("/business-otp-verify", responseHandler(otpVerify));

app.post("/business-sign-up", Upload.array("file"), responseHandler(businessSignUp))

module.exports = app;