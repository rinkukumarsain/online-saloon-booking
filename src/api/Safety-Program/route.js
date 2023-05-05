const { Router } = require("express");
const responseHandler = require("../../utils/responseHandlers");
const auth = require("../../middleware/auth");
const { createCoupon, editCoupon, getCoupon } = require('./controller');
const app = Router();
const { joi_createCoupon, joi_EditCoupon } = require("../../middleware/joi_createCoupon")

app.get("/get-coupon", auth, responseHandler(getCoupon))


module.exports = app;