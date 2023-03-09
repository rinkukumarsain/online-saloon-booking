const auth = require("../../middleware/adminauth")
const Upload = require("../../middleware/img");
const { Router } = require("express");
const app = Router();
const { ADD_SALOON ,ADD_SALOON_STORE} = require("./contollers");

app.get("/add_saloon", auth,ADD_SALOON)

app.post("/add_saloon_store",auth,Upload.array("image"),ADD_SALOON_STORE)
// app.get("/pages-register", register);
// app.post("/register-admin-data", adminRegisterData);

// app.get("/login", login);
// app.post("/login-admin-data", loginData);

// app.get("/users-profile", auth, usersProfile);

module.exports = app