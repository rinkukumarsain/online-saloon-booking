const mongoose = require("mongoose");
const newsletters = require("../../api/Newsletter/model");
const user = require("../../api/user/model");
const saloon = require("../../api/saloonstore/model");
const ContecUs = require("../../api/Contact-Us/model");

exports.sendNotification = async (req, res) => {
    try {
        if (req.user.type == "admin") {
            return res.redirect("/")
        }
        res.locals.message = req.flash();
        let data
        if (req.query.id != undefined && req.query.id != "") {
            data = await ContecUs.findOne({ _id: req.query.id })
        }

        res.render("newsletters/index", { user: req.user, data });
    } catch (error) {
        console.log(error);
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
        if (req.query.ContectUs != undefined && req.query.ContectUs != "") {
            const data = await ContecUs.findOne({ _id: req.query.ContectUs })
            arr = [data.email]
        }
        req.arr = arr;
        const result = await newLetterEmail(req);

        if (result.statusCode == 200) {
            const data = await ContecUs.findByIdAndUpdate({ _id: req.query.ContectUs }, { status: 1 }, { new: true })
            req.flash("success", "mail send  successfully");
            res.redirect("/");
        };
    } catch (error) {
        console.log(error);
    };
};



