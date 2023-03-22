const auth = require("../../middleware/adminauth")
const Upload = require("../../middleware/img");
const { Router } = require("express");
const app = Router();
const { ADD_BLOG, ADD_BLOG_STORE, VIEW_BLOG, DELETE_BLOG, ViwesFindBlog } = require('./controllers');
app.get("/add_blog", auth, ADD_BLOG)

app.post("/add_blog_store", auth, Upload.single("image"), ADD_BLOG_STORE)

app.get("/view_blog", auth, VIEW_BLOG)
app.get("/delete_blog", auth, DELETE_BLOG)
app.get("/Viwes-Find-Blog", auth, ViwesFindBlog)

module.exports = app