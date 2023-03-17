const category = require("../../api/category/model");
const mongoose = require('mongoose');
exports.AddCategory = async (req, res, _id) => {
    try {
        const id = mongoose.Types.ObjectId(_id)
        if (req.file != undefined && req.file) {
            req.body.image = req.file.filename
        }
        else {
            req.body.image = "file-16750761578851648814435361.png"
        }
        const img = req.file;
        // console.log("------", req.body)
        if (req.body.id != undefined && req.body.id.length == 24) {
            // console.log("update")
            if (req.body.parent_Name) {
                const updateuserdata = await category.findOneAndUpdate({ _id: id }, {
                    $set: {
                        parent_Name: req.body.parent_Name,
                        Name: req.body.Name,
                        image: req.body.image
                    }
                })
            } else {
                // console.log("update  else")
                const updateuserdata = await category.findOneAndUpdate({ _id: id }, {
                    $set: {
                        Name: req.body.Name,
                        image: req.body.image
                    }
                })
            }
            const updateuserdata = await category.findOneAndUpdate({ _id: id }, {
                // $set: {
                // parent_Name: req.body.parent_Name,
                Name: req.body.Name,
                image: req.body.image
                // }
            })
            // console.log("updateuserdata", updateuserdata)
            res.redirect("/view-category")
        } else {

            if (req.body.parent_Name) {
                const data = new category({
                    parent_Name: req.body.parent_Name,
                    Name: req.body.Name,
                    image: req.body.image
                })
                const save = await data.save()
            } else {
                // console.log("add else")
                const data = new category({
                    Name: req.body.Name,
                    image: req.body.image
                })
                const save = await data.save()
            }
            res.redirect("/view-category")

        }
    } catch (error) {
        console.log(error)
    }
}
