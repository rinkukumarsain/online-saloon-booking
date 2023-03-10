const auth = require("../../middleware/adminauth")
const Upload = require("../../middleware/img");
const responseHandler = require("../../utils/responseHandlers");
const { Router } = require("express");
const app = Router();
const { saloonRegistration, viewssaloonrequest, add_Saloon_View, viewSaloon, getSaloonsDataTable, saloonAllRequistDatatable, saloonApproval, saloonRequistDelete } = require('./controller');

app.get("/views-saloon-request", auth, viewssaloonrequest);
app.get("/saloon-all-requist-datatable", auth, saloonAllRequistDatatable)

app.get("/saloon-requist-approval", auth, saloonApproval);
app.get("/saloon-request-delete", auth, saloonRequistDelete);

// app.get("*", auth, (req, res) => {
//     // console.log("url", req.url)
// })

app.get("/add_saloon_view", auth, add_Saloon_View);
app.post("/saloon-registration", auth, saloonRegistration);
app.get("/view-saloon", auth, viewSaloon);
app.get("/get-saloons-dataTable", auth, getSaloonsDataTable);



module.exports = app