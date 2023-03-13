const userRoutes = require("./user/route");
const category = require("./category/route");
const saloonService = require("./saloonService/route");
const saloonstore = require("./saloonstore/route");
const cart = require("./cart/route");
const schedule = require("./Schedule/route");
const address = require("./address/route");
const checkOut = require("./Checkout/route");
const order = require("./order/route");
const userWishlist = require("./user-wishlist/route")
const blog = require("./blogs/route")
const ContactUs = require("./Contact-Us/route")
const payment = require("./payment/route")
const Partner = require("./Partner/route")
const reviews = require("./reviews/route")

module.exports = [userRoutes, category, saloonstore, saloonService,
    cart, schedule, address, checkOut,
    order, userWishlist, blog, ContactUs, payment, Partner, reviews];