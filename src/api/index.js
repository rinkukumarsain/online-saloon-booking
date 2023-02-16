const userRoutes = require("./user/route");
const category = require("./category/route");
const saloonService = require("./saloonService/route")
const saloonstore = require("./saloonstore/route")
const cart = require("./cart/route")
const schedule = require("./Schedule/route")

module.exports = [userRoutes, category, saloonstore, saloonService, cart, schedule]