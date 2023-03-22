const payment = require("../../api/payment/model");
const mongoose = require("mongoose");
const { getAllSaloonCity } = require("../../api/saloonstore/controller");
const moment = require("moment")
/*
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
*/
exports.ViewAllPayment = async (req, res) => {
    try {
        const updateData = await payment.aggregate([
            {
                '$lookup': {
                    'from': 'users',
                    'localField': 'userId',
                    'foreignField': '_id',
                    'pipeline': [
                        {
                            '$project': {
                                'name': 1
                            }
                        }
                    ],
                    'as': 'user'
                }
            }, {
                '$unwind': {
                    'path': '$user'
                }
            }
        ]);

        updateData.forEach((item) => {
            let Date = moment(item.createdAt).format("DD-MMM-YYYY");
            let Time = moment(item.createdAt).format("hh:mm:ss");
            item.Date = Date
            item.Time = Time
            // console.log("--->", item);
        });

        if (updateData.length > 0) {
            res.render("payment/View-All-payment", { user: req.user, data: updateData });
        };
    } catch (error) {
        console.log(error);
    };
};

exports.DeletePayment = async (req, res) => {
    try {

        if (req.query.id != undefined && req.query.id != "") {
            const updateData = await payment.findByIdAndDelete({ _id: mongoose.Types.ObjectId(req.query.id) })
            if (updateData) {
                // console.log("updateData", updateData)
                res.redirect("/view-all-payment");
            };
        } else {
            res.redirect("/");
        }
    } catch (error) {
        console.log(error);
    };
};

