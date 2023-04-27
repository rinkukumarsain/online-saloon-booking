const { Router } = require("express");
const responseHandler = require("../../utils/responseHandlers");
const auth = require("../../middleware/auth");
const { Checkout, applyBalance } = require('./controller');
const app = Router();

app.get("/Checkout", auth, responseHandler(Checkout));
app.get("/apply-balance", auth, responseHandler(applyBalance))

module.exports = app;