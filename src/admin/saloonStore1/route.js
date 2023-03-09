const auth = require("../../middleware/adminauth")
const Upload = require("../../middleware/img");
const responseHandler = require("../../utils/responseHandlers");
const { Router } = require("express");
const app = Router();
const { saloonRegistration, addSaloon, add_Saloon_View, viewSaloon, getSaloonsDataTable, saloonAllRequistDatatable, saloonApproval } = require('./controller');

app.get("/add-saloon", auth, addSaloon);
app.get("/saloon-all-requist-datatable", auth, saloonAllRequistDatatable)
app.get("/saloon-approval", auth, saloonApproval)

app.get("/add_saloon_view", auth, add_Saloon_View);
app.post("/saloon-registration", auth, saloonRegistration);
app.get("/view-saloon", auth, viewSaloon);
app.get("/get-saloons-dataTable", auth, getSaloonsDataTable)



module.exports = app