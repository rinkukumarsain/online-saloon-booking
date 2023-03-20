const category = require("../../api/category/model");
const blog = require("../../api/blogs/model");
const mongoose = require("mongoose")
const service = require("./services")

exports.ADD_BLOG = async (req, res) => {
    const category_data = await category.find({ parent_Name: null })
    const _id = req.query.id
    const user = req.user
    const blog_data = await blog.findOne({_id})
    res.render("blog/add_blog",{user,category_data,_id,blog_data})
}

exports.ADD_BLOG_STORE = async (req, res) => {
    try {
        let { body, file, query } = req
        console.log(file)
        console.log("--->", req.body)
        console.log("==>", req.files)
        console.log(req.query)
        res.locals.message = req.flash();
        if (query.id) {

            let _id = mongoose.Types.ObjectId(query.id);
            const result = await blog.findOne({ _id });
            if (result) {
                let obj = {};
                    if (body.category) { obj.category = body.category };
                    if (body.Title) { obj.Title = body.Title };
                    if (body.WriteDate) { obj.WriteDate = body.WriteDate };
                    if (body.WriterName) { obj.WriterName = body.WriterName };
                    if (body.description) { obj.Description = body.description };
                    if (file) {
                        img = []
                        img.push(file.filename)
                        obj.image = img
                    }
                    const result = await blog.findByIdAndUpdate({ _id }, { $set: obj }, { new: true });
                    if (result) {
                        req.flash("success", "Blog  is  Update successfull !")
                        res.redirect("/")
                    };
               
            } else {
                req.flash("error", "Blog is Not Found !")
                res.redirect("/")
            };
        } else {
            if (file) {
                img = []
                img.push(file.filename)
                body.image = img
            } else {
                body.image = ""
            }
            let blog_details = new blog({
                Title: body.Title,
                WriterName: body.WriterName,
                WriteDate: body.WriteDate,
                Description: body.description,
                image: body.image,
                category:  mongoose.Types.ObjectId(body.category)
            });
            const result = await blog_details.save();
            res.send()
        }
    }
    catch (err) {
        console.log(err)
    }
}

exports.VIEW_BLOG = async (req, res) => {
    const user = req.user
    const data = await service.VIEW_BLOG()
    res.render("blog/view_blog",{data,user})
}

exports.DELETE_BLOG = async (req, res) => { 
    const id = req.query.id
    await blog.findByIdAndDelete({ _id: id })
    res.redirect("/view_blog")
}