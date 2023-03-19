// require('dotenv').config();
//const {  AddCategory, add_sub_categorys, viwes_categorys, } = require("../services/loginuser")
// const jwt = require("jsonwebtoken")
// const Users = require("../module/user")
const {AddCategory}= require("./service")
const CategoryModule = require("../../api/category/model");
// const { default: mongoose } = require('mongoose');
exports.Category = async (req, res) => {
    try { const user = req.user 
        res.render("addcategory/create_category",{user})
    } catch (error) {
        console.log("UserData", error)
    }
}








let _id;
exports.AddCategory = async (req, res, next) => {
    try {
        if (!_id) {
            await AddCategory(req, res)
        } else {
            await AddCategory(req, res, _id)
        }
    } catch (error) {
        console.log("UserData", error)
    }
}
exports.ViwesCategory = async (req, res) => {
    try {const user = req.user

        // console.log(" view-category>", req.params.id)
        // console.log(" view-category> quiry", req.query.id)
        const _id = req.query.id

        if (_id != undefined) {
            console.log("_id",_id)
            // console.log(" view-category> if", _id)
            res.render("addcategory/views_category", { _id,user })
        } else {
            // console.log(" view-category> else", _id)
            res.render("addcategory/views_category",{user,_id:null})
        }
    } catch (error) {
        console.log("UserData", error)
    }
}
exports.ViwesCategoryes = async (req, res) => {
    try {
        // console.log("datatable load>", req.params)
        // console.log(" datatable load> quiry", req.query.id)
        let condition
        let limit = req.query.length;
        let start = req.query.start;
        if (req.query.id) {
            condition = { parent_Name: req.query.id };
        } else {
            condition = { parent_Name: null };
        }
        CategoryModule.countDocuments(condition).exec((err, row) => {
            if (err) console.log(err);
            let newData = row
            let data = [];
            let count = 1;
            let i = 1
            CategoryModule.find(condition).limit(limit).skip(start).exec(async (err, row1) => {

                // }
                // row1.forEach(async (index) => {
                for await (const index of row1) {
                    const FindData = await CategoryModule.find({ parent_Name: index._id })
                    // console.log("index", i, FindData.length)
                    i++
                    let dele;
                    if (FindData.length > 0) {
                        //dele = `<a href="view-category/${index._id}"> Viwe</a>    ||  <a href="add/${index._id}"> Add Sub category</a>`
                        dele = `<a href=/view-category/?id=${index._id}> view</a>    ||  <a href=/sub_category/${index._id}> Add Sub category</a>`
                    } else {
                        dele = `<a href="/delete/${index._id}">delete</a>    ||  <a href="/sub_category/${index._id}"> Add Sub category</a>`
                    }
                    data.push({
                        "count": count,
                        "Name": index.Name,
                        "image": `<img src="/uploads/${index.image}"  width="50" height="60">`,
                        "Action": `<a href="/edit/${index._id}">Edit</a> || ${dele}`,
                        // "delete": dele,
                    });
                    count++;
                };
                if (count > row1.length) {
                    let jsonValue = JSON.stringify({
                        recordsTotal: row,
                        recordsFiltered: newData,
                        data: data
                    });
                    res.send(jsonValue);
                }
            });
        });
    } catch (error) {
        console.log("ViwesCategoryes", error)
    }
}

exports.edit_category = async (req, res) => {
    try {const user = req.user
        _id = req.params.id
        // console.log("req.params.id", _id);
        if (_id) {
            const update_data = await CategoryModule.find({ _id })
            // console.log("edit_category", update_data)
            if (update_data) {
                res.render("addcategory/edit_category", { update_data,user });
            }
        }
    } catch (error) {
        console.log("UserData", error)
    }
}
exports.delete_category = async (req, res) => {
    try {
        _id = req.params.id
        let find2;
        let ffff;
        // console.log("delete_category", _id);
        let find = await CategoryModule.findOne({ _id })
        if (find.parent_Name != null) {
            find2 = await CategoryModule.findOne({ _id: find.parent_Name })
        }
        // console.log("find..", find2.parent_Name)
        if (find2) {
            if (find2.parent_Name != null) {
                ffff = find2.parent_Name.toString()
            }
        }
        // console.log("find2stringify", ffff)
        // kvjhbkjvhbkjn
        const result = await CategoryModule.findByIdAndRemove({ _id });
        if (result) {
            if (ffff != undefined && ffff.length == 24) {
                // console.log("delete_category")
                res.redirect(`/view-category/?id=${ffff}`)
            } else {
                res.redirect(`/view-category`)
            }
        }

    } catch (error) {
        console.log("UserData", error)
    }
}