const { Router } = require("express");
const responseHandler = require("../../utils/responseHandlers");
const { artistSignup } = require('./controller');
const app = Router();
const uplode = require("../../middleware/img")

app.post("/artist-signup", responseHandler(artistSignup))


module.exports = app