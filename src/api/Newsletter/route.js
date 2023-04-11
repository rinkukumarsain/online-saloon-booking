const { Router } = require("express");
const responseHandler = require("../../utils/responseHandlers");
const { Newsletter } = require('./controller');
const app = Router();
const uplode = require("../../middleware/img")

app.post("/Newsletter", responseHandler(Newsletter))


module.exports = app