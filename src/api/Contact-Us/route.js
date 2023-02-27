const { Router } = require("express");
const responseHandler = require("../../utils/responseHandlers");
const auth = require("../../middleware/auth");
const { ContactUs } = require('./controller');
const app = Router();

app.post("/Contact-Us", auth, responseHandler(ContactUs));

module.exports = app;