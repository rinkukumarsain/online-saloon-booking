const auth = require("../../middleware/adminauth");
const { Router } = require("express");
const app = Router();
const { ContactUsRequist } = require('./controller');

app.get("/Contact-Us-Requist", auth, ContactUsRequist);

module.exports = app;