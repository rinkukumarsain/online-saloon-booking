const auth = require("../../middleware/adminauth")
const Upload = require("../../middleware/img");
const responseHandler = require("../../utils/responseHandlers");
const { Router } = require("express");
const app = Router();
const { saloonRegistration, viewssaloonrequest, add_Saloon_View,
    viewSaloon, getSaloonsDataTable, saloonApproval, saloonRequistDelete } = require('./controller');

app.get("/views-saloon-request", auth, viewssaloonrequest);

app.get("/saloon-requist-approval", auth, saloonApproval);
app.get("/saloon-request-delete", auth, saloonRequistDelete);


app.get("/add_saloon_view", auth, add_Saloon_View);
app.post("/saloon-registration", auth, saloonRegistration);
app.get("/view-saloon", auth, viewSaloon);
app.get("/get-saloons-dataTable", auth, getSaloonsDataTable);



module.exports = app