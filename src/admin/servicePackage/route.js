const auth = require("../../middleware/adminauth");
const { Router } = require("express");
const app = Router();
const { package, FindServiceForPackages, CreatePackage, viewServicePackage, deletePackage, FindPackageService } = require('./controller');

const { joi_createCoupon } = require("../../middleware/joi_createCoupon");

app.get("/package", auth, package);
app.post("/Create-Package", auth, CreatePackage);
app.get("/Find-Service-for-Packages", auth, FindServiceForPackages);
// app.post("/Service-Price-Totel", auth, ServicePriceTotel);

app.get("/view-service-Package", auth, viewServicePackage)
app.get("/delete_package", auth, deletePackage)
// app.post("/Create-Coupon", auth,  createCoupon);
app.get("/Find-Package-service", auth, FindPackageService);
// app.get("/Delete-Coupon", auth, DeleteCoupon);


module.exports = app;