const { Router } = require("express");
const responseHandler = require("../../utils/responseHandlers");
const { saloonService, add_Service } = require('./controller');
const Upload = require("../../middleware/img");
const app = Router();

app.get("/saloonService/:id?", responseHandler(saloonService));
app.post("/add-Service", Upload.single("file"), responseHandler(add_Service));


module.exports = app;