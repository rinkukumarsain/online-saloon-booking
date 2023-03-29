const { Router } = require("express");
const responseHandler = require("../../utils/responseHandlers");
const auth = require("../../middleware/auth");
const { userOrder, getUserOrder, orderCancel } = require('./controller');
const app = Router();

app.get("/order", auth, responseHandler(userOrder));
app.get("/get-user-order", auth, responseHandler(getUserOrder));

app.get("/order-cancel", auth, responseHandler(orderCancel))

module.exports = app;