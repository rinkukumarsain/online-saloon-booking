const auth = require("../../middleware/adminauth")
const Upload = require("../../middleware/img");
const responseHandler = require("../../utils/responseHandlers");
const { Router } = require("express");
const app = Router();
const { add_Saloon, addSaloon, add_Saloon_View, viewSaloon, getSaloons } = require('./controller');

app.get("/add-saloon", auth, addSaloon);
app.get("/add_saloon_view", auth, add_Saloon_View);
app.post("/add_saloon", auth, add_Saloon);
app.get("/view-saloon", auth, viewSaloon);
app.get("/get-saloons", auth, getSaloons)



module.exports = app