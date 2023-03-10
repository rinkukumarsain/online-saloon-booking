const { Router } = require("express");
const responseHandler = require("../../utils/responseHandlers");
const { registerSaloonStore, getSaloonStore, getAllSaloonCity } = require('./controller');
const auth = require("../../middleware/auth");
const Upload = require("../../middleware/img");
const app = Router();

app.post("/register-saloon-store/:id?", auth, Upload.array("file"), responseHandler(registerSaloonStore));
app.get("/saloon-store/:id?", auth, responseHandler(getSaloonStore));
app.get("/get-all-saloon-city", auth, responseHandler(getAllSaloonCity))

module.exports = app;