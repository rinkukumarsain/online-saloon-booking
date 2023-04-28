const Contact = require("../../api/Contact-Us/model");
const mongoose = require("mongoose");
const { getAllSaloonCity } = require("../../api/saloonstore/controller");

exports.ContactUsRequist = async (req, res) => {
    try {
        if (req.user.type == "admin") {
            return res.redirect("/")
        }
        if (req.query.id != undefined && req.query.id != "") {
            const data = await Contact.findOne({ _id: mongoose.Types.ObjectId(req.query.id) });
            if (data) {
                res.render("Contact-Us/index", { query: req.query, user: req.user, data });
            }
        } else {
            const data = await Contact.find();
            res.render("Contact-Us/index", { query: req.query, user: req.user, data });
        };
    } catch (error) {
        console.log(error);
    };
};

