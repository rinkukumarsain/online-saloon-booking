const coupon = require("../../api/coupon/model");
const mongoose = require("mongoose");
const { getAllSaloonCity } = require("../../api/saloonstore/controller");

exports.Coupon = async (req, res) => {
    try {
        if (req.query.id != undefined && req.query.id != "") {
            const Coupon = await coupon.findOne({ _id: mongoose.Types.ObjectId(req.query.id) });
            if (Coupon) {
                res.render("Coupon/index", { user: req.user, Coupon });
            }
        } else {
            res.render("Coupon/index", { user: req.user });
        };
    } catch (error) {
        console.log(error);
    };
};

exports.createCoupon = async (req, res) => {
    try {
        if (req.query.id != undefined && req.query.id != "") {
            const _id = mongoose.Types.ObjectId(req.query.id);

            const updateData = await coupon.findByIdAndUpdate({ _id }, req.body, { new: true });
            if (updateData) {
                res.redirect("/View-All-Coupon");
            };
        } else {
            if (req.body.CouponCode != undefined && req.body.CouponCode != "") {
                const findData = await coupon.findOne({ CouponCode: req.body.CouponCode });
                if (!findData) {
                    req.body.CouponCode = req.body.CouponCode;
                } else {
                    res.redirect("/Coupon");
                };
            };
            const couponditail = new coupon(req.body);
            const result = await couponditail.save();
            if (result) {
                res.redirect("/View-All-Coupon");
            };
        };
    } catch (error) {
        console.log(error);
    };
};

exports.ViewAllCoupon = async (req, res) => {
    try {
        const updateData = await coupon.find();
        if (updateData.length > 0) {
            res.render("Coupon/view-View-Coupon", { user: req.user, data: updateData });
        };
    } catch (error) {
        console.log(error);
    };
};

exports.DeleteCoupon = async (req, res) => {
    try {

        if (req.query.id != undefined && req.query.id != "") {
            const updateData = await coupon.findByIdAndDelete({ _id: mongoose.Types.ObjectId(req.query.id) })
            if (updateData) {
                // console.log("updateData", updateData)
                res.redirect("/View-All-Coupon");
            };
        } else {
            res.redirect("/");
        }
    } catch (error) {
        console.log(error);
    };
};


