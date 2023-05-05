const auth = require("../../middleware/adminauth")
const Upload = require("../../middleware/img");
const { Router } = require("express");
const app = Router();
const { Vacancy, FindserviceforAdmin, addVacency, ViewVacancy, findVacancy, deletVacancy } = require('./controllers');

app.get("/Vacancy", auth, Vacancy)
app.post("/add-vacency", auth, addVacency)
app.get("/delete-Vacancy", auth, deletVacancy)

app.get("/View-Vacancy", auth, ViewVacancy)
app.get("/find-Vacancy", findVacancy)

//ajex url
app.get("/Find-service-for-Admin", FindserviceforAdmin)


module.exports = app