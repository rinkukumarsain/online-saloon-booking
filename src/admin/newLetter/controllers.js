const mongoose = require("mongoose");
const newsletters = require("../../api/Newsletter/model");
const user = require("../../api/user/model");
const saloon = require("../../api/saloonstore/model");

exports.sendNotification = async (req, res) => {
    try {
        if (req.user.type == "admin") {
            return res.redirect("/")
        }
        res.locals.message = req.flash();
        // req.flash("success", "login successfully");
        let data;
        res.render("newsletters/index", { user: req.user, data });
    } catch (e) {
        console.log(e);
    };
};

const { newLetterEmail } = require("../../middleware/mail");

exports.SendAllUserEmail = async (req, res) => {
    try {
        let arr;
        const newsletterData = await newsletters.distinct("email");
        const userData = await user.distinct("email");
        const saloonData = await saloon.distinct("email");
        if (req.body.status == 0) {
            arr = [...newsletterData, ...userData, ...saloonData];
            arr.flat(2);
        } else if (req.body.status == 1) {
            arr = saloonData;
        } else if (req.body.status == 2) {
            arr = userData;
        } else if (req.body.status == 3) {
            arr = newsletterData;
        };
        req.arr = arr;
        const result = await newLetterEmail(req);

        if (result.statusCode == 200) {
            req.flash("success", "mail send  successfully");
            res.redirect("/");
        };
    } catch (e) {
        console.log(e);
    };
};



