
const { AddCategory } = require("./service");
const CategoryModule = require("../../api/category/model");
const mongoose = require('mongoose');

exports.Category = async (req, res) => {
    try {
        if (req.query.id != undefined && req.query.id != "") {
            res.render("category/index", { user: req.user, id: req.query.id })
        } else if (req.query.EditId != undefined && req.query.EditId != "") {
            const findData = await CategoryModule.findOne({ _id: mongoose.Types.ObjectId(req.query.EditId) })
            res.render("category/index", { user: req.user, data: findData })
        } else {
            res.render("category/index", { user: req.user })
        }
    } catch (error) {
        console.log("UserData", error)
    }
}

exports.AddCategory = async (req, res) => {
    try {
        await AddCategory(req, res)
    } catch (error) {
        console.log("UserData", error)
    }
}

exports.ViwesCategory = async (req, res) => {
    try {
        let condition = {}
        if (req.query.id) {
            condition = { parent_Name: req.query.id };
        } else {
            condition = { parent_Name: null };
        }

        let data = await CategoryModule.find(condition)

        let dele;
        for (const item of data) {
            const FindData = await CategoryModule.find({ parent_Name: item._id })

            if (FindData.length > 0) { dele = `view` } else { dele = `delete` }

            item._doc.del = dele
            dele = ""
        }
        if (data) {
            res.render("category/view-category", { data, user: req.user })
        } else {
            res.redirect("/")
        }
    } catch (error) {
        console.log(error)
    }
}


exports.DeleteCategory = async (req, res) => {
    try {
        console.log(req.query)
        const result = await CategoryModule.findByIdAndRemove({ _id: mongoose.Types.ObjectId(req.query.id) })
        console.log("req.query", result)
        if (result) {
            res.redirect("/view-category")
        } else {
            res.redirect("/")
        }
    } catch (error) {
        console.log("UserData", error)
    }
}
