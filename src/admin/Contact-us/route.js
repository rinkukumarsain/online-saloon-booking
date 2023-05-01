const auth = require("../../middleware/adminauth");
const { Router } = require("express");
const app = Router();
const { ContactUsRequist, rejectRequist } = require('./controller');

app.get("/Contact-Us-Requist", auth, ContactUsRequist);
app.get("/Reject-requist", rejectRequist)
module.exports = app;