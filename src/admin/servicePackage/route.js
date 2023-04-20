const auth = require("../../middleware/adminauth");
const { Router } = require("express");
const app = Router();
const { package, FindServiceForPackages, CreatePackage, viewServicePackage, deletePackage, FindPackageService, viewServicePackageparticular,
 addNewPackage, newPackageCreate, viewPackage, findPackageServices } = require('./controller');

const { joi_createCoupon } = require("../../middleware/joi_createCoupon");

app.get("/package", auth, package);
app.post("/Create-Package", auth, CreatePackage);
app.get("/Find-Service-for-Packages", auth, FindServiceForPackages);
// app.post("/Service-Price-Totel", auth, ServicePriceTotel);

app.get("/view-service-Package", auth, viewServicePackage)
// sahil view packge
app.get("/view-service-Package-particular", auth, viewServicePackageparticular)
// sahil view package end
app.get("/delete_package", auth, deletePackage)
// app.post("/Create-Coupon", auth,  createCoupon);
app.get("/Find-Package-service", auth, FindPackageService);
// app.get("/Delete-Coupon", auth, DeleteCoupon);

const Upload = require("../../middleware/img");
//create a pakege in service cillection insert 
app.get("/add-new-package", auth, addNewPackage)
app.post("/add-new-package", auth, Upload.single("file"), newPackageCreate)
app.get("/view-package", auth, viewPackage)

// ajex
app.get("/Find-Package-Services", auth, findPackageServices)

module.exports = app;