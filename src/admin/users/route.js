const auth = require("../../middleware/adminauth");
const { Router } = require("express");
const app = Router();
const { allUser, BlockUser, warning, warningPage, unblock, userWalletAction } = require('./controller');

const { joi_createCoupon } = require("../../middleware/joi_createCoupon");

app.get("/all-user", auth, allUser)
app.get("/unblock", auth, unblock)
app.get("/Block-User", auth, BlockUser)
app.get("/warningpage", auth, warningPage)
app.post("/warning", auth, warning)
app.get("/wallet-Action", auth, userWalletAction)


module.exports = app;