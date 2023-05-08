const user = require("../../api/user/model");
const mongoose = require("mongoose");
const { getAllSaloonCity } = require("../../api/saloonstore/controller");
const moment = require("moment")
const { allUser } = require("./services")
const { sendmailwarning } = require("../../middleware/mail");
const { findOne } = require("../../api/user/model");

exports.allUser = async (req, res) => {
    try {
        if (req.user.type == "admin") {
            return res.redirect("/")
        }
        res.locals.message = req.flash();
        const Finddata = await allUser(req)
        res.render("users/view-user", { data: Finddata.data, user: req.user, query: req.query, })
    } catch (error) {
        console.log(error);
    };
};

exports.BlockUser = async (req, res) => {
    try {
        const Finddata = await user.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(req.query.id) }, { type: "block-User" }, { new: true })
        if (Finddata) {
            res.redirect("/all-user")
        }
    } catch (error) {
        console.log(error);
    };
};
exports.warningPage = async (req, res) => {
    try {
        const data = await user.findOne({ _id: mongoose.Types.ObjectId(req.query.id) })
        res.render("users/warning", { id: req.query.id, data, user: req.user })
    } catch (error) {
        console.log(error);
    };
};

exports.warning = async (req, res) => {
    try {
        res.locals.message = req.flash();
        req.userData = await user.findOne({ _id: mongoose.Types.ObjectId(req.query.id) })
        const sendmailer = await sendmailwarning(req)
        if (sendmailer) {
            req.flash("success", "mail send successfully")
            res.redirect("/all-user")
        } else {
            req.flash("error", "mail not Send")
            res.redirect("/all-user")
        }
    } catch (error) {
        console.log(error);
    };
};
exports.unblock = async (req, res) => {
    try {
        let Finddata;
        res.locals.message = req.flash();
        const data = await user.findOne({ _id: mongoose.Types.ObjectId(req.query.id) });
        if (data.type == "block-User") {
            Finddata = await user.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(req.query.id) }, { type: "user" }, { new: true })
        } else {
            Finddata = await user.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(req.query.id) }, { type: "admin" }, { new: true })
        }
        req.flash("success", "unblock successfully")
        if (Finddata) {
            res.redirect("/all-user")
        }
    } catch (error) {
        console.log(error);
    };
};
const { walletTransaction } = require("../../api/refer And ponts/controller")
exports.userWalletAction = async (req, res) => {
    try {
        res.locals.message = req.flash();
        let obj = {};
        obj.$inc = {};

        if (req.query.status == "debit") {
            const findUser = await user.findOne({ _id: mongoose.Types.ObjectId(req.query.id) });

            if (req.query.type == "point") {
                if (findUser.userWallet.point >= req.query.amount) {
                    obj.$inc["userWallet.point"] = -Number(req.query.amount);
                } else {
                    req.flash("error", "insufficient point");
                    return res.redirect("/all-user");
                }
            } else {
                if (findUser.userWallet.balance >= req.query.amount) {
                    obj.$inc["userWallet.balance"] = -Number(req.query.amount);
                } else {
                    req.flash("error", "insufficient balance");
                    return res.redirect("/all-user");
                }
            };
        } else {
            if (req.query.type == "point") {
                obj.$inc["userWallet.point"] = +Number(req.query.amount);
            } else {
                obj.$inc["userWallet.balance"] = +Number(req.query.amount);
            };
        };
        const result = await user.findByIdAndUpdate({ _id: req.query.id }, obj, { new: true });
        if (result) {
            let body = {}
            body.userId = result._id
            body.moneyType = req.query.type
            body.fromUserId = req.user._id
            body.status = "succes"
            body.amount = req.query.amount
            body.type = req.query.status
            req.body = body
            const saveTragaction = await walletTransaction(req)

            req.flash("success", "update  successfully");
            res.redirect("/all-user");
        } else {
            res.redirect("/");
        };
    } catch (error) {
        console.log(error);
    };
};
