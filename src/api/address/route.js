const { Router } = require("express");
const responseHandler = require("../../utils/responseHandlers")
const auth = require("../../middleware/auth")
const { addUserAddress, getUserAddress, addAddresssInUserCart } = require('./controller');
const app = Router();
app.post("/add-user-address", auth, responseHandler(addUserAddress))
app.get("/get-user-address", auth, responseHandler(getUserAddress))
app.get("/add-addresss-in-user-cart", auth, responseHandler(addAddresssInUserCart))

/*
app.post("/Schedule-your-visit", auth, responseHandler(scheduleYourVisit))
// app.get("/remove-servish-from-cart", auth, responseHandler(removeServishFromCart))

// app.post("/Edit-cart", auth, responseHandler(EditCart))
*/
module.exports = app