const { Router } = require("express");
const responseHandler = require("../../utils/responseHandlers")
const auth = require("../../middleware/auth")
const { cartRegistration, editCart, removeServishFromCart, getcart } = require('./controller');
const app = Router();

app.post("/cart-registration", auth, responseHandler(cartRegistration))
app.post("/edit-Cart", auth, responseHandler(editCart))
app.get("/remove-servish-from-cart", auth, responseHandler(removeServishFromCart))
app.get("/get-cart", auth, responseHandler(getcart))


// app.post("/Edit-cart", auth, responseHandler(EditCart))

module.exports = app