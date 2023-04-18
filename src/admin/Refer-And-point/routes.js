const auth = require("../../middleware/adminauth");
const Upload = require("../../middleware/img");
const { Router } = require("express");
const app = Router();
const { setPointToRupee, pointAndRupee, ViewReferEarn, deletReferEranProgram } = require('./controllers');

app.get("/Set-point-to-rupee", auth, setPointToRupee);
app.post("/Set-Point-To-Rupee", auth, pointAndRupee);
app.get("/View-Refer-Earn", auth, ViewReferEarn);
app.get("/Delete-Refer-Eran-program", auth, deletReferEranProgram);



module.exports = app;