const auth = require("../../middleware/adminauth")
const Upload = require("../../middleware/img");
const responseHandler = require("../../utils/responseHandlers");
const { Router } = require("express");
const app = Router();
const { admin, register, adminRegisterData, loginData, login,
    usersProfile, AdminlogOut, forgetPassword, ForgetPassword,
    add_profile_data, paymentRevenues } = require('./controller');
app.get("/", admin)

app.get("/pages-register", register);
app.post("/register-admin-data", adminRegisterData);

app.get("/login", login);
app.post("/login-admin-data", loginData);

app.get("/forget-password", auth, forgetPassword)
app.post("/Forget-password", auth, ForgetPassword)
app.get("/users-profile", auth, usersProfile);
app.post("/add_profile_data", auth, Upload.single("image"), add_profile_data)

app.get("/Admin-log-out", AdminlogOut)

// ajex
app.get("/payment-Revenues", auth, paymentRevenues)

module.exports = app