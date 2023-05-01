const Contact = require("../../api/Contact-Us/model");
const mongoose = require("mongoose");
const { getAllSaloonCity } = require("../../api/saloonstore/controller");

exports.ContactUsRequist = async (req, res) => {
    try {
        if (req.user.type == "admin") {
            return res.redirect("/")
        }
        let condition = {}
        if (req.query.phone != undefined && req.query.phone != "") {
            condition.phone = Number(req.query.phone)
        }
        if (req.query.name != undefined && req.query.name != "") {
            condition.name = { $regex: req.query.name }
        }
        if (req.query.email != undefined && req.query.email != "") {
            condition.email = { $regex: req.query.email }
        }

        if (req.query.id != undefined && req.query.id != "") {
            condition._id = mongoose.Types.ObjectId(req.query.id)
        }
        
        if (req.query.status != undefined && req.query.status != "") {
            condition.status = Number(req.query.status)
        } else {
            condition.status = 0
        }

        const data = await Contact.find(condition);
        res.render("Contact-Us/index", { query: req.query, user: req.user, data });

    } catch (error) {
        console.log(error);
    };
};

exports.rejectRequist = async (req, res) => {
    try {
        const data = await Contact.findByIdAndUpdate({ _id: req.query.id }, { status: -1 }, { new: true })
        if (data) {
            res.redirect("/Contact-Us-Requist")
        }
    } catch (error) {
        console.log(error);
    };
}
