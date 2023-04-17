const { Router } = require("express");
const responseHandler = require("../../utils/responseHandlers");
const auth = require("../../middleware/auth")
const { getServicePackage, getReviews, updateLikeDislike } = require('./controller');
const app = Router();
const uplode = require("../../middleware/img");

// app.post("/add-reviews", auth, responseHandler(addReviews));
app.get("/get-service-Package", responseHandler(getServicePackage));
// app.get("/update-like-dislike", auth, responseHandler(updateLikeDislike))


module.exports = app