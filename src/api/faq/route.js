const { Router } = require("express");
const responseHandler = require("../../utils/responseHandlers");
const { getFaq, AskQustion } = require('./controller');
const app = Router();

app.get("/get-faq", responseHandler(getFaq));


app.get("/Ask-qustion", responseHandler(AskQustion));

module.exports = app;