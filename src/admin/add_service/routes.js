const auth = require("../../middleware/adminauth")
const Upload = require("../../middleware/img");
const { Router } = require("express");
const app = Router();
const { ADD_SERVICE, ADD_SERVICE_STORE, VIEW_SERVICE, DELETE_SERVICE, optiongeturl, findSallon } = require("./controllers");

app.get("/add_service", auth, ADD_SERVICE)

app.post("/add_service_store", auth, Upload.array("image"), ADD_SERVICE_STORE)

app.get("/view_service", auth, VIEW_SERVICE)

app.get("/delete_service", DELETE_SERVICE)
app.get("/optiongeturl/:id?", optiongeturl)
app.get("/find-Sallon", findSallon)
// app.get("/pages-register", register);
// app.post("/register-admin-data", adminRegisterData);

// app.get("/login", login);
// app.post("/login-admin-data", loginData);

// app.get("/users-profile", auth, usersProfile);

module.exports = app