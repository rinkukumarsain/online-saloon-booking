
const { AddCategory } = require("./service");
const CategoryModule = require("../../api/category/model");
const mongoose = require('mongoose');

exports.Category = async (req, res) => {
    try {
        if (req.user.type == "admin") {
            return res.redirect("/")
        }
        if (req.query.id != undefined && req.query.id != "") {
            res.render("category/index", { user: req.user, id: req.query.id })
        } else if (req.query.EditId != undefined && req.query.EditId !== "") {
            const findData = await CategoryModule.findOne({ _id: mongoose.Types.ObjectId(req.query.EditId) })
            res.render("category/index", { user: req.user, data: findData })
        } else {
            res.render("category/index", { user: req.user })
        }
    } catch (error) {
        console.log(error)
    }
}

exports.AddCategory = async (req, res) => {
    try {
        await AddCategory(req, res)
    } catch (error) {
        console.log(error)
    }
}

exports.ViwesCategory = async (req, res) => {
    try {
        if (req.user.type == "admin") {
            return res.redirect("/")
        }
        let condition = {}
        if (req.query.CategoryName != undefined && req.query.CategoryName != "") {
            condition = { Name: { $regex: req.query.CategoryName, $options: 'i' } };
        } else if (req.query.id != undefined && req.query.id != "") {
            condition = { parent_Name: req.query.id };
        } else if (req.query.status != undefined && req.query.status != "") {
            condition = {}
        } else {
            condition = { parent_Name: null };
        }
        if (req.query.type != undefined && req.query.type != "") {
            condition.type = Number(req.query.type)
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
            res.render("category/view-category", { query: req.query, data, user: req.user })
        } else {
            res.redirect("/")
        }
    } catch (error) {
        console.log(error)
    }
}


exports.DeleteCategory = async (req, res) => {
    try {
        if (req.user.type == "admin") {
            return res.redirect("/")
        }
        const result = await CategoryModule.findByIdAndRemove({ _id: mongoose.Types.ObjectId(req.query.id) })
        if (result) {
            res.redirect("/view-category")
        } else {
            res.redirect("/")
        }
    } catch (error) {
        console.log(error)
    }
}

