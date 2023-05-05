const auth = require("../../middleware/adminauth")
const Upload = require("../../middleware/img");
const { Router } = require("express");
const app = Router();
const { ADD_SERVICE, ADD_SERVICE_STORE, VIEW_SERVICE, DELETE_SERVICE, optiongeturl, findSallon } = require("./controllers");

app.get("/add_service", auth, ADD_SERVICE)

app.post("/add_service_store", auth, Upload.array("image"), ADD_SERVICE_STORE)

app.get("/view_service", auth, VIEW_SERVICE)

app.get("/delete_service", DELETE_SERVICE)
app.get("/optiongeturl/:id?", optiongeturl)
app.get("/find-Sallon", findSallon)

module.exports = app