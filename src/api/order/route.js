const { Router } = require("express");
const responseHandler = require("../../utils/responseHandlers");
const auth = require("../../middleware/auth");
const { userOrder } = require('./controller');
const app = Router();

app.get("/order", auth, responseHandler(userOrder));

module.exports = app;