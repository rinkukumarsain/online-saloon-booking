const { Router } = require("express");
const responseHandler = require("../../utils/responseHandlers");
const Upload = require("../../middleware/img");
const auth = require("../../middleware/auth");
const { businessSignUp, otpSent, otpVerify, businessProfileInfo, businessBankInfo, businessUplodeDocument } = require('./controller');
const app = Router();

app.post("/business-otp-sent", responseHandler(otpSent));
app.post("/business-otp-verify", responseHandler(otpVerify));



app.post("/business-sign-up", responseHandler(businessSignUp))
app.post("/business-profile-info", responseHandler(businessProfileInfo))
app.post("/business-bank-information", responseHandler(businessBankInfo))
app.post("/business-uplode-document", Upload.fields([{
    name: 'BannerLogo', maxCount: 1
}, {
    name: 'logoImage', maxCount: 1
}, {
    name: 'panImage', maxCount: 1
}, {
    name: 'businessCertificate', maxCount: 1
}]), responseHandler(businessUplodeDocument))



module.exports = app;