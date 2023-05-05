const auth = require("../../middleware/adminauth")
const Upload = require("../../middleware/img");
const { Router } = require("express");
const app = Router();
const { ADD_SALOON, ADD_SALOON_STORE, VIEW_SALOON, DELETE_SALOON,
    GetSaloonAddress, viewsSaloonRequest, saloonApproval, saloonRequistDelete,
    findAddSaloonRequist, saloonRegister, businessProfileInfo, businessProfile,
    businessBankInfoForm, businessBankInfoAdmin, businessUplodeDocument,
    businessUplodeDocumentAdmin, findSaloonByUser, FindAdminAllSaloon,
    addImagesInSaloon } = require("./contollers");

app.get("/view_saloon", auth, VIEW_SALOON)
app.get("/delete_saloon", DELETE_SALOON)
app.get("/get-saloon-address", auth, GetSaloonAddress)

app.get("/add_saloon", auth, saloonRegister)
app.post("/add_saloon_store", auth, ADD_SALOON_STORE)
app.post("/business-profile-info-by-Admin", auth, businessProfile)
app.post("/business-bank-information-admin", auth, businessBankInfoAdmin)

app.post("/business-uplode-document-admin", auth, Upload.fields([{
    name: 'BannerLogo', maxCount: 1
}, {
    name: 'logoImage', maxCount: 1
}, {
    name: 'panImage', maxCount: 1
}, {
    name: 'businessCertificate', maxCount: 1
}]), businessUplodeDocumentAdmin)


app.post("/Add-images-in-saloon", Upload.array("image"), auth, addImagesInSaloon)


app.get("/Find-Admin-All-saloon", auth, FindAdminAllSaloon)





app.get("/views-saloon-request", auth, viewsSaloonRequest);
app.get("/saloon-requist-approval", auth, saloonApproval);
app.get("/saloon-request-delete", auth, saloonRequistDelete);
app.get("/find-Add-Saloon-Requist", auth, findAddSaloonRequist)


app.get("/find-saloon-by-user", auth, findSaloonByUser)
module.exports = app