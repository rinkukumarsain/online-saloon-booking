const { Router } = require("express");
const responseHandler = require("../../utils/responseHandlers");
const { ContactUs } = require('./controller');
const app = Router();

app.post("/Contact-Us", responseHandler(ContactUs));

module.exports = app;