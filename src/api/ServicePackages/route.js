const { Router } = require("express");
const responseHandler = require("../../utils/responseHandlers");
const auth = require("../../middleware/auth")
const { getServicePackage, packageCartAdd } = require('./controller');
const app = Router();
const uplode = require("../../middleware/img");

app.get("/get-service-Package", auth, responseHandler(getServicePackage));

module.exports = app