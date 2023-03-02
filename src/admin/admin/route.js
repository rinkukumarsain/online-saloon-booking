const auth = require("../../middleware/auth")
const Upload = require("../../middleware/img");
const responseHandler = require("../../utils/responseHandlers");
const { Router } = require("express");
const app = Router();
const { registerView, registerData, loginData, loginView, dashboardView } = require('./controller');

app.get("/register", registerView);
app.post("/register-admin-data", registerData);
app.get("/login", loginView);
app.post("/login-admin-data", loginData);
app.get("/dashboard", dashboardView);
module.exports = app