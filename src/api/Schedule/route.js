const { Router } = require("express");
const responseHandler = require("../../utils/responseHandlers");
const auth = require("../../middleware/auth");
const { scheduleYourVisit } = require('./controller');
const app = Router();

app.post("/Schedule-your-visit", auth, responseHandler(scheduleYourVisit));

module.exports = app;