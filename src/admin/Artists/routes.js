const auth = require("../../middleware/adminauth")
const Upload = require("../../middleware/img");
const { Router } = require("express");
const app = Router();
const { Artists,  } = require('./controllers');

app.get("/Artists", auth, Artists)

module.exports = app