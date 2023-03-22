const { Router } = require("express");
const responseHandler = require("../../utils/responseHandlers");
const Upload = require("../../middleware/img");
const auth = require("../../middleware/auth");
const { PartnerRegistrationForm } = require('./controller');
const app = Router();



app.post("/Partner-Registration-Form", auth, Upload.array("file"), responseHandler(PartnerRegistrationForm))

module.exports = app;