const auth = require("../../middleware/adminauth")
const Upload = require("../../middleware/img");
const responseHandler = require("../../utils/responseHandlers");
const { Router } = require("express");
const app = Router();
const { add_Saloon, login_Add_Saloon_View, add_Saloon_View, view_saloon } = require('./controller');

app.get("/login_add_saloon_view", auth, login_Add_Saloon_View);
app.get("/add_saloon_view", auth, add_Saloon_View);
app.post("/add_saloon", auth, add_Saloon);
app.post("/view_saloon", auth, view_saloon);
module.exports = app