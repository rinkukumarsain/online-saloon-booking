const { Router } = require("express");
const responseHandler = require("../../utils/responseHandlers")
const { getCategoryListing, getAllCategoryListing } = require('./controller');
const app = Router();

const categoryModule = require("./model")

app.get("/getCategoryListing/:id?", responseHandler(getCategoryListing))
app.get("/getAllCategoryListing", responseHandler(getAllCategoryListing))


module.exports = app