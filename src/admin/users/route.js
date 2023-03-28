const auth = require("../../middleware/adminauth");
const { Router } = require("express");
const app = Router();
const { allUser, BlockUser, } = require('./controller');

const { joi_createCoupon } = require("../../middleware/joi_createCoupon");

app.get("/all-user", auth, allUser)

app.get("/Block-User", auth, BlockUser)


module.exports = app;