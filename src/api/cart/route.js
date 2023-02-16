const { Router } = require("express");
const responseHandler = require("../../utils/responseHandlers")
const auth = require("../../middleware/auth")
const { cartRegistration, removeServishFromCart } = require('./controller');
const app = Router();

app.post("/cart-registration", auth, responseHandler(cartRegistration))
app.get("/remove-servish-from-cart", auth, responseHandler(removeServishFromCart))


// app.post("/Edit-cart", auth, responseHandler(EditCart))

module.exports = app