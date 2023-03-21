const auth = require("../../middleware/adminauth");
const { Router } = require("express");
const app = Router();
const { Coupon, createCoupon, ViewAllPayment, DeletePayment } = require('./controller');

const { joi_createCoupon } = require("../../middleware/joi_createCoupon");

// app.get("/Coupon", auth, Coupon);
// app.post("/Create-Coupon", auth, joi_createCoupon, createCoupon);
app.get("/view-all-payment", auth, ViewAllPayment);
app.get("/Delete-payment", auth, DeletePayment);


module.exports = app;