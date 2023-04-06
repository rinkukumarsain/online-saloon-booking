const auth = require("../../middleware/adminauth")
const Upload = require("../../middleware/img");
const { Router } = require("express");
const app = Router();
const { Vacancy, FindserviceforAdmin, addVacency } = require('./controllers');

app.get("/Vacancy", auth, Vacancy)
app.post("/add-vacency", addVacency)

//ajex url
app.get("/Find-service-for-Admin", FindserviceforAdmin)
// app.get("/Find-Artists", auth, )

module.exports = app