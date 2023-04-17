const auth = require("../../middleware/adminauth");
const Upload = require("../../middleware/img");
const { Router } = require("express");
const app = Router();
const { setPointToRupee, pointAndRupee, ViewReferEarn } = require('./controllers');

app.get("/Set-point-to-rupee", auth, setPointToRupee);
app.post("/Set-Point-To-Rupee", auth, pointAndRupee);
app.get("/View-Refer-Earn", auth, ViewReferEarn);



module.exports = app;