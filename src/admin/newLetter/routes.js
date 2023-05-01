const auth = require("../../middleware/adminauth")
const Upload = require("../../middleware/img");
const { Router } = require("express");
const app = Router();
const { sendNotification, SendAllUserEmail, } = require('./controllers');


app.get("/Send-notification", auth, sendNotification)
app.post("/Send-All-User-Email", auth, SendAllUserEmail)


module.exports = app