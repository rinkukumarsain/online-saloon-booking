const auth = require("../../middleware/adminauth")
const Upload = require("../../middleware/img");
const { Router } = require("express");
const app = Router();
const { ADD_SALOON, ADD_SALOON_STORE, VIEW_SALOON, DELETE_SALOON, GetSaloonAddress } = require("./contollers");

app.get("/add_saloon", auth, ADD_SALOON)

app.post("/add_saloon_store", auth, Upload.array("image"), ADD_SALOON_STORE)

app.get("/view_saloon", auth, VIEW_SALOON)

app.get("/get-saloon-address", auth, GetSaloonAddress)

app.get("/delete_saloon", DELETE_SALOON)


module.exports = app