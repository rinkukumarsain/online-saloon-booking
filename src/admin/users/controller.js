const user = require("../../api/user/model");
const mongoose = require("mongoose");
const { getAllSaloonCity } = require("../../api/saloonstore/controller");
const moment = require("moment")
const { allUser } = require("./services")
const { sendmailwarning } = require("../../middleware/mail");
const { findOne } = require("../../api/user/model");

exports.allUser = async (req, res) => {
    try {
        res.locals.message = req.flash();
        const Finddata = await allUser(req)
        res.render("users/view-user", { data: Finddata.data, user: req.user, query: "", searchobj: Finddata.searchobj })
    } catch (error) {
        console.log(error);
    };
};

exports.BlockUser = async (req, res) => {
    try {res.locals.message = req.flash();
        // console.log("re", req.query.id)
        let Finddata;
        const data=await user.findOne({_id:mongoose.Types.ObjectId(req.query.id)});
        if(data.type=="user")
        {
         Finddata = await user.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(req.query.id) }, { type: "block-User" }, { new: true })
        }
        else
        {
             Finddata = await user.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(req.query.id) }, { type: "block-admin" }, { new: true })

        }
        req.flash("success","block successfully")
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
        // req.userData = userData
        const sendmailer = await sendmailwarning(req)
        console.log("sendmailer", sendmailer);
        // gfhklv
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
    try {let Finddata;
        res.locals.message = req.flash();
        const data=await user.findOne({_id:mongoose.Types.ObjectId(req.query.id)});
        if(data.type=="user")
        {
         Finddata = await user.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(req.query.id) }, { type: "user" }, { new: true })
        }
        else
        {
             Finddata = await user.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(req.query.id) }, { type: "admin" }, { new: true })

        }
        req.flash("success","unblock successfully")
        if (Finddata) {
            res.redirect("/all-user")
        }
    } catch (error) {
        console.log(error);
    };
};

