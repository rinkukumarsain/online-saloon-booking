const { Router } = require("express");
const responseHandler = require("../../utils/responseHandlers");
const auth = require("../../middleware/auth");
const { getFaq } = require('./controller');
const app = Router();

app.get("/get-faq", auth, responseHandler(getFaq));

module.exports = app;