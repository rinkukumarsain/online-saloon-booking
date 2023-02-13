const { Router } = require("express");
const responseHandler = require("../../utils/responseHandlers")
const { saloonService, add_Service } = require('./controller');

const Upload = require("../../middleware/img");
const app = Router();

app.get("/saloonService/:id?", responseHandler(saloonService))

//add_Service servish edit and add new Service 10/02/2023 saam ko raat me 
app.post("/add-Service", Upload.single("file"), responseHandler(add_Service))



module.exports = app