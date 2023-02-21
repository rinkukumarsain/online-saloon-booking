const { Router } = require("express");
const responseHandler = require("../../utils/responseHandlers");
const auth = require("../../middleware/auth");
const { userWishlist, getWishlist } = require('./controller');
const app = Router();

app.get("/user-wishlist", auth, responseHandler(userWishlist));
app.get("/get-wishlist", auth, responseHandler(getWishlist));

module.exports = app;