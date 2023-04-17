const { Router } = require("express");
const responseHandler = require("../../utils/responseHandlers");
const auth = require("../../middleware/auth");
const { userWishlist, getWishlist } = require('./controller');
const app = Router();

app.get("/get-wishlist", auth, responseHandler(getWishlist));

app.get("/wishlist", auth, responseHandler(userWishlist));

// app.get("/remove-store-from-wishlist", auth, responseHandler(removeStoreFromWishlist));

module.exports = app;