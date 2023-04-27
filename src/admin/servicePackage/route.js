const auth = require("../../middleware/adminauth");
const Upload = require("../../middleware/img");
const { Router } = require("express");
const app = Router();
const { FindServiceForPackages, deletePackage, addNewPackage,
 newPackageCreate, viewPackage, findPackageServices } = require('./controller');

const { joi_createCoupon } = require("../../middleware/joi_createCoupon");

//create a pakege in service cillection insert 
app.get("/add-new-package", auth, addNewPackage);//1
app.post("/add-new-package", auth, Upload.single("file"), newPackageCreate);//3
app.get("/view-package", auth, viewPackage);//4
app.get("/delete_package", auth, deletePackage);//5

app.get("/Find-Service-for-Packages", auth, FindServiceForPackages);//2
// ajex
app.get("/Find-Package-Services", auth, findPackageServices);

module.exports = app;