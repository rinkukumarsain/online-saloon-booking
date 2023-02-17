const { Router } = require("express");
const responseHandler = require("../../utils/responseHandlers")
const auth = require("../../middleware/auth")
const { Checkout } = require('./controller');
const app = Router();

app.get("/Checkout", auth, responseHandler(Checkout))

module.exports = app