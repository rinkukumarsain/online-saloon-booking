const auth = require("../../middleware/adminauth");
const { Router } = require("express");
const app = Router();
const { Coupon, createCoupon, ViewAllCoupon, DeleteCoupon } = require('./controller');

const { joi_createCoupon } = require("../../middleware/joi_createCoupon");

app.get("/Coupon", auth, Coupon);
app.post("/Create-Coupon", auth,  createCoupon);
app.get("/View-All-Coupon", auth, ViewAllCoupon);
app.get("/Delete-Coupon", auth, DeleteCoupon);


module.exports = app;