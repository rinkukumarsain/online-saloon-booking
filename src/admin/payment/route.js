const auth = require("../../middleware/adminauth");
const { Router } = require("express");
const app = Router();
const { ViewAllPayment, DeletePayment } = require('./controller');

app.get("/view-all-payment", auth, ViewAllPayment);
app.get("/Delete-payment", auth, DeletePayment);


module.exports = app;