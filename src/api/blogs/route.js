const { Router } = require("express");
const responseHandler = require("../../utils/responseHandlers");
const auth = require("../../middleware/auth")
const { creatBlog, getAllBlog } = require('./controller');
const app = Router();
const uplode = require("../../middleware/img")

app.post("/Write-blog", auth, uplode.single("file"), responseHandler(creatBlog))
app.get("/get-blog", responseHandler(getAllBlog))


module.exports = app