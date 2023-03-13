const { Router } = require("express");
const responseHandler = require("../../utils/responseHandlers");
const { saloonService, add_Service, getAllSaloonServiceByCatogory, getServiceByCategory, getSaloonByLocation } = require('./controller');
const Upload = require("../../middleware/img");
const app = Router();
const auth = require("../../middleware/auth")

app.get("/saloonService/:id?", auth, responseHandler(saloonService));
app.post("/add-Service", auth, Upload.single("file"), responseHandler(add_Service));
app.get("/get-all-saloon-Service-by-catogory", auth, responseHandler(getAllSaloonServiceByCatogory))
app.get("/get-Service-By-Category", auth, responseHandler(getServiceByCategory))

app.get("/get-saloon-by-location", auth, responseHandler(getSaloonByLocation))


module.exports = app;