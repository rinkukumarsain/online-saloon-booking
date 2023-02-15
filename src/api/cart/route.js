const { Router } = require("express");
const responseHandler = require("../../utils/responseHandlers")
const auth = require("../../middleware/auth")
const { cartRegistration } = require('./controller');
const app = Router();

app.post("/cart-registration", auth, responseHandler(cartRegistration))


module.exports = app