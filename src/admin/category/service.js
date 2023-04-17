const CategoryModal = require("../../api/category/model");
const mongoose = require('mongoose');

exports.AddCategory = async (req, res, _id) => {
    try {
        if (req.query.EditId != undefined && req.query.EditId != "") {
            if (req.file != undefined && req.file) {
                req.body.image = req.file.filename
            }
            if (req.query.id != "" && req.query.id != undefined) {
                req.body.parent_Name = mongoose.Types.ObjectId(req.query.id)
            }
            const result = await CategoryModal.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(req.query.EditId) }, req.body, { new: true })
            res.redirect("/view-category")
        } else {
            if (req.file != undefined && req.file) {
                req.body.image = req.file.filename
            } else {
                req.body.image = ""
            }
            if (req.query.id != "" && req.query.id != undefined) {
                req.body.parent_Name = mongoose.Types.ObjectId(req.query.id)
            } else {
                req.body.parent_Name = null
            }
            const data = new CategoryModal({
                parent_Name: req.body.parent_Name,
                Name: req.body.Name,
                image: req.body.image,
                type: req.body.type
            })
            const result = await data.save()
            res.redirect("/view-category")
        }
    } catch (error) {
        console.log(error)
    }
}
