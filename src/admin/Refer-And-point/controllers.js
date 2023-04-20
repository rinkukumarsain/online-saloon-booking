const refer = require("./model");
const mongoose = require("mongoose");
const { query } = require("express");


exports.setPointToRupee = async (req, res) => {
    try {
        res.locals.message = req.flash();
        let data;
        const { query, ...rest } = req;
        if (req.query.id != undefined && req.query.id != "") {
            data = await refer.findOne({ _id: req.query.id });
        }
        res.render("Refer-And-point/index", { user: req.user, data });
    } catch (error) {
        console.log(error);
    };
};

exports.pointAndRupee = async (req, res) => {
    try {
        res.locals.message = req.flash();
        let result;
        if (req.query.id != undefined && req.query.id != "") {
            result = await refer.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(req.query.id) }, req.body, { new: true });
            if (result) {
                req.flash("success", "update succsfully");
                res.redirect("/View-Refer-Earn");
            };
        } else {
            const referDetail = new refer(req.body);
            result = await referDetail.save();
            if (result) {
                req.flash("success", "created succsfully");
                res.redirect("/View-Refer-Earn");
            }
        }
        if (!result) {
            req.flash("error", "samething is Wroung");
            res.redirect("/Set-point-to-rupee");
        };
    } catch (error) {
        console.log(error);
    };
};

exports.ViewReferEarn = async (req, res) => {
    try {
        const data = await refer.find();
        if (data) {
            res.render("Refer-And-point/viwe-refer", { data, user: req.user, query: req.query });
        };
    } catch (error) {
        console.log(error);
    };
};


exports.deletReferEranProgram = async (req, res) => {
    try {
        const data = await refer.findByIdAndDelete({ _id: mongoose.Types.ObjectId(req.query.id) });
        res.redirect("/View-Refer-Earn")
    } catch (error) {
        console.log(error);
    };
};
