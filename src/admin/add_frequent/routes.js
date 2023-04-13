const auth = require("../../middleware/adminauth");
const Upload = require("../../middleware/img");
const { Router } = require("express");
const app = Router();
const { ADD_FREQUENT, ADD_FREQUENT_DATA, VIEW_FREQUENT, DELETE_FREQUENT, ViwesFindQustion } = require("./controller");

app.get("/add_frequent", auth, ADD_FREQUENT)
app.post("/addfrequentdata", auth, ADD_FREQUENT_DATA)
app.get("/view_frequent", auth, VIEW_FREQUENT)
app.get("/delete_frequent", auth, DELETE_FREQUENT)
app.get("/Viwes-Find-Qustion", auth, ViwesFindQustion)


module.exports = app