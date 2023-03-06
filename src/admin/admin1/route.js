const auth = require("../../middleware/adminauth")
const Upload = require("../../middleware/img");
const responseHandler = require("../../utils/responseHandlers");
const { Router } = require("express");
const app = Router();
const { admin, register, adminRegisterData, loginData, login,
    usersProfile } = require('./controller');
app.get("/", admin)

app.get("/pages-register", register);
app.post("/register-admin-data", adminRegisterData);

app.get("/login", login);
app.post("/login-admin-data", loginData);

app.get("/users-profile", auth, usersProfile);

module.exports = app