const auth = require("../../middleware/adminauth")
const Upload = require("../../middleware/img");
const responseHandler = require("../../utils/responseHandlers");
const { Router } = require("express");
const app = Router();
const { saloonRegistration, addSaloon, add_Saloon_View, viewSaloon, getSaloons, saloonAllRequistDatatable } = require('./controller');

app.get("/add-saloon", auth, addSaloon);
app.get("/saloon-all-requist-datatable", auth, saloonAllRequistDatatable)
app.get("/add_saloon_view", auth, add_Saloon_View);
app.post("/saloon-registration", auth, saloonRegistration);
app.get("/view-saloon", auth, viewSaloon);
app.get("/get-saloons", auth, getSaloons)



module.exports = app