const { Router } = require("express");
const responseHandler = require("../../utils/responseHandlers");
const auth = require("../../middleware/auth")
const { pointToMoneyConvert, addReviews, getReviews, updateLikeDislike } = require('./controller');
const app = Router();
const uplode = require("../../middleware/img");

app.get("/point-to-money-convert", auth, responseHandler(pointToMoneyConvert))



module.exports = app