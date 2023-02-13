const { Router } = require("express");
const responseHandler = require("../../utils/responseHandlers")
const { registerSaloonStore, } = require('./controller');
const auth = require("../../middleware/auth")
const Upload = require("../../middleware/img");

const app = Router();

app.post("/register-saloon-store", auth, Upload.single("file"), responseHandler(registerSaloonStore))

module.exports = app