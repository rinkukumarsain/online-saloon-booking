const auth = require("../../middleware/adminauth")
const Upload = require("../../middleware/img");
const responseHandler = require("../../utils/responseHandlers");
const { Router } = require("express");
const app = Router();
const { admin, register, adminRegisterData, loginData, login,
    usersProfile, AdminlogOut, forgetPassword, ForgetPassword } = require('./controller');
app.get("/", admin)

app.get("/pages-register", register);
app.post("/register-admin-data", adminRegisterData);

app.get("/login", login);
app.post("/login-admin-data", loginData);

app.get("/forget-password", auth, forgetPassword)
app.post("/Forget-password", auth, ForgetPassword)
app.get("/users-profile", auth, usersProfile);

app.get("/Admin-log-out", AdminlogOut)

module.exports = app