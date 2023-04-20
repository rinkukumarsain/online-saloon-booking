const { Router } = require("express");
const responseHandler = require("../../utils/responseHandlers");
const auth = require("../../middleware/auth");
const { removeserviceFromCart, getcart, addcart, removeCart } = require('./controller');
const app = Router();


app.get("/remove-service-from-cart", auth, responseHandler(removeserviceFromCart));
app.get("/get-cart", auth, responseHandler(getcart));
app.get("/add-cart", auth, responseHandler(addcart));
app.get("/remove-cart", auth, responseHandler(removeCart));

module.exports = app;