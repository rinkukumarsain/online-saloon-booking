const auth = require("../../middleware/adminauth")
const Upload = require("../../middleware/img");
const { Router } = require("express");
const { Category, AddCategory, ViwesCategory, DeleteCategory } = require("./controller");
const app = Router();

app.get("/category", auth, Category)
app.post("/Add-New-Category", auth, Upload.single("file"), AddCategory)
app.get("/view-category", auth, ViwesCategory)
app.get("/delete-category", auth, DeleteCategory)


module.exports = app