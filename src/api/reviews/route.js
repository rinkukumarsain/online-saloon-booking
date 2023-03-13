const { Router } = require("express");
const responseHandler = require("../../utils/responseHandlers");
const auth = require("../../middleware/auth")
const { addReviews, getReviews } = require('./controller');
const app = Router();
const uplode = require("../../middleware/img");

app.post("/add-reviews", auth, responseHandler(addReviews));
app.get("/get-reviews", auth, responseHandler(getReviews))


module.exports = app