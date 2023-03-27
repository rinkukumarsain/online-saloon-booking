const auth = require("../../middleware/adminauth")
const Upload = require("../../middleware/img");
const { Router } = require("express");
const app = Router();
const { ADD_SALOON, ADD_SALOON_STORE, VIEW_SALOON, DELETE_SALOON,
    GetSaloonAddress, viewsSaloonRequest, saloonApproval, saloonRequistDelete,
    findAddSaloonRequist, saloonRegister, businessProfileInfo, businessProfile } = require("./contollers");

// app.get("/add_saloon", auth, ADD_SALOON)
// app.post("/add_saloon_store", auth, Upload.array("image"), ADD_SALOON_STORE)

app.get("/view_saloon", auth, VIEW_SALOON)
app.get("/delete_saloon", DELETE_SALOON)
app.get("/get-saloon-address", auth, GetSaloonAddress)


app.get("/add_saloon", auth, saloonRegister)
app.post("/add_saloon_store", auth, Upload.array("image"), ADD_SALOON_STORE)

app.get("/business-profile-info", auth, businessProfileInfo)
app.post("/business-profile-info", auth, businessProfile)






app.get("/views-saloon-request", auth, viewsSaloonRequest);

app.get("/saloon-requist-approval", auth, saloonApproval);
app.get("/saloon-request-delete", auth, saloonRequistDelete);
app.get("/find-Add-Saloon-Requist", auth, findAddSaloonRequist)


module.exports = app