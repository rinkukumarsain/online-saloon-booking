const { Router } = require("express");
const responseHandler = require("../../utils/responseHandlers");
const auth = require("../../middleware/auth");
const { PartnerRegistrationForm } = require('./controller');
const app = Router();

// app.post("/cart-registration", auth, responseHandler(cartRegistration));

// app.get("/remove-service-from-cart", auth, responseHandler(removeserviceFromCart));
// app.get("/get-cart", auth, responseHandler(getcart));
// app.get("/add-cart", auth, responseHandler(addcart))

// app.get("/get-Count-of-service-in-user-cart", auth, responseHandler(GetCountOfServiceInUserCart))
app.post("/Partner-Registration-Form", auth, responseHandler(PartnerRegistrationForm))
module.exports = app;