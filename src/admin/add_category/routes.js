const auth = require("../../middleware/adminauth")
const Upload = require("../../middleware/img");
const { Router } = require("express");
const app = Router();
const {Category, AddCategory ,ViwesCategory,ViwesCategoryes,edit_category,delete_category} = require("./controller");


//category
app.get("/category",auth, Category)
app.post("/add_category",auth, Upload.single("file"), AddCategory)
// app.get("/view-category", ViwesCategory)
app.get("/view-category/:id?",auth, ViwesCategory)
app.get("/viwes_categoryes/:id?",auth, ViwesCategoryes)

// edit delete
app.get("/edit/:id",auth, edit_category)
app.get("/delete/:id",auth, delete_category)

// app.get("/pages-register", register);
// app.post("/register-admin-data", adminRegisterData);

// app.get("/login", login);
// app.post("/login-admin-data", loginData);

// app.get("/users-profile", auth, usersProfile);

module.exports = app