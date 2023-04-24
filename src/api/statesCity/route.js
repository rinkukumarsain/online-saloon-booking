const { Router } = require("express");
const responseHandler = require("../../utils/responseHandlers");
const auth = require("../../middleware/auth")
const { getStates, findCity } = require('./controller');
const app = Router();
const uplode = require("../../middleware/img");


app.get("/States", auth, responseHandler(getStates));
app.get("/city", auth, responseHandler(findCity))
module.exports = app