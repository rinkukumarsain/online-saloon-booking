const userRoutes = require("./user/route");
const category = require("./category/route");
const saloonService = require("./saloonService/route")
const saloonstore = require("./saloonstore/route")

module.exports = [userRoutes, category, saloonstore, saloonService]