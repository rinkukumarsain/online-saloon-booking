const { Router } = require("express");
const responseHandler = require("../../utils/responseHandlers");
const auth = require("../../middleware/auth");
const { createCoupon, editCoupon, getCoupon } = require('./controller');
const app = Router();
const { joi_createCoupon, joi_EditCoupon } = require("../../middleware/joi_createCoupon")

app.post("/create-coupon", auth, joi_createCoupon, responseHandler(createCoupon))
app.post("/edit-Coupon", auth, joi_EditCoupon, responseHandler(editCoupon))
app.get("/get-coupon", auth, responseHandler(getCoupon))


module.exports = app;