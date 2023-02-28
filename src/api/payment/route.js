const { Router } = require("express");
const responseHandler = require("../../utils/responseHandlers");
const auth = require("../../middleware/auth");
const { payment } = require('./controller');
const app = Router();

// app.get("/Checkout", auth, responseHandler(Checkout));
app.post('/payment',  auth, responseHandler(payment));

module.exports = app;