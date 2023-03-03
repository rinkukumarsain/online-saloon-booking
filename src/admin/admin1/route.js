const auth = require("../../middleware/adminauth")
const Upload = require("../../middleware/img");
const responseHandler = require("../../utils/responseHandlers");
const { Router } = require("express");
const app = Router();
const { registerView, registerData, loginData, loginView, dashboardView  } = require('./controller');

app.get("/register", registerView);
app.post("/register-admin-data", registerData);
app.get("/login", loginView);
app.post("/login-admin-data", loginData);
app.get("/dashboard", auth, dashboardView);
//app.get("/login_add_saloon_view", auth, login_Add_Saloon_View);
//app.get("/add_saloon_view", auth, add_Saloon_View);
//app.post("/add_saloon", auth, add_Saloon);
//app.post("/view_saloon", auth, view_saloon);
module.exports = app