const auth = require("../../middleware/adminauth")
const { Router } = require("express");
const app = Router();
const { getAllOrder, orderCancel, AdminOrderApprove, FindDateForAdminModule } = require('./controller');


app.get("/get-All-order", auth, getAllOrder)
app.get("/Admin-Order-Cancel", auth, orderCancel)
app.get("/Admin-Order-Approve", auth, AdminOrderApprove)
app.get("/Find-date-for-admin-module", auth, FindDateForAdminModule)


module.exports = app