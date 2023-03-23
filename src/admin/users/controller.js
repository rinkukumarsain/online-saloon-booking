const user = require("../../api/user/model");
const mongoose = require("mongoose");
const { getAllSaloonCity } = require("../../api/saloonstore/controller");
const moment = require("moment")
const { allUser } = require("./services")


exports.allUser = async (req, res) => {
    try {
        const Finddata = await allUser(req)
        console.log("Finddata", Finddata)
        res.render("users/view-user", { data: Finddata.data, user: req.user, query: "" })
    } catch (error) {
        console.log(error);
    };
};

exports.BlockUser = async (req, res) => {
    try {
        console.log("re", req.query.id)
        const Finddata = await user.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(req.query.id) }, { type: "block-User" }, { new: true })
        if (Finddata) {
            res.redirect("/all-user")
        }
    } catch (error) {
        console.log(error);
    };
};
