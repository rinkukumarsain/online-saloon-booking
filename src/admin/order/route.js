const auth = require("../../middleware/adminauth")
// const Upload = require("../../middleware/img");
// const responseHandler = require("../../utils/responseHandlers");
const { Router } = require("express");
const app = Router();
const { getAllOrder, orderCancel } = require('./controller');


app.get("/get-All-order", auth, getAllOrder)
app.get("/Admin-Order-Cancel", auth, orderCancel)

module.exports = app