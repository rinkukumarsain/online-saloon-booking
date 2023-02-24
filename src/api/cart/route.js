const { Router } = require("express");
const responseHandler = require("../../utils/responseHandlers");
const auth = require("../../middleware/auth");
const { cartRegistration, removeServishFromCart, getcart, addcart } = require('./controller');
const app = Router();

app.post("/cart-registration", auth, responseHandler(cartRegistration));

app.get("/remove-servish-from-cart", auth, responseHandler(removeServishFromCart));
app.get("/get-cart", auth, responseHandler(getcart));
app.post("/add-cart", auth, responseHandler(addcart))

module.exports = app;