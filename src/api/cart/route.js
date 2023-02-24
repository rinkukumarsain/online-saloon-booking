const { Router } = require("express");
const responseHandler = require("../../utils/responseHandlers");
const auth = require("../../middleware/auth");
const { cartRegistration, removeserviceFromCart, getcart, addcart } = require('./controller');
const app = Router();

// app.post("/cart-registration", auth, responseHandler(cartRegistration));

app.get("/remove-service-from-cart", auth, responseHandler(removeserviceFromCart));
app.get("/get-cart", auth, responseHandler(getcart));
app.post("/add-cart", auth, responseHandler(addcart))

module.exports = app;