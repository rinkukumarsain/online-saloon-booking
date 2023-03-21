const adminRoutes = require("./admin1/route");
const saloonstore = require("./saloonStore1/route");

const add_saloone = require("./add_saloon/routes");
const add_service = require("./add_service/routes");
const add_frequent = require("./add_frequent/routes");
const order = require("./order/route")
const add_blog = require("./blog/routes");
const Counpon = require("./Coupon/route");
const payment = require("./payment/route");
const category = require("./category/routes")

module.exports = [adminRoutes, saloonstore, add_saloone, add_service,
    add_frequent, order, add_blog, category, Counpon, payment]
