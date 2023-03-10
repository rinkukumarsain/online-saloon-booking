const auth = require("../../middleware/adminauth")
const Upload = require("../../middleware/img");
const { Router } = require("express");
const app = Router();
const {ADD_FREQUENT} = require("./controller");

app.get("/add_frequent", auth, ADD_FREQUENT)

// app.post("/add_service_store", auth, Upload.array("image"), ADD_SERVICE_STORE)

// app.get("/view_service", auth, VIEW_SERVICE)

// app.get("/delete_service",DELETE_SERVICE)

module.exports = app