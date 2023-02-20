const { Router } = require("express");
const responseHandler = require("../../utils/responseHandlers");
const auth = require("../../middleware/auth")
const { getCategoryListing, getAllCategoryListing, getServiceByCategory } = require('./controller');
const app = Router();

app.get("/getCategoryListing/:id?", auth, responseHandler(getCategoryListing))
app.get("/getAllCategoryListing", auth, responseHandler(getAllCategoryListing))
app.get("/get-Service-By-Category", auth, responseHandler(getServiceByCategory))

module.exports = app