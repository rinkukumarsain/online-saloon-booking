// require('dotenv').config();
//const {  AddCategory, add_sub_categorys, viwes_categorys, } = require("../services/loginuser")
// const jwt = require("jsonwebtoken")
// const Users = require("../module/user")
const mongoose = require('mongoose');
const { AddCategory,add_sub_categorys } = require("./service")
const CategoryModule = require("../../api/category/model");
// const { default: mongoose } = require('mongoose');
exports.Category = async (req, res) => {
    try {
        const user = req.user
        res.render("addcategory/create_category", { user })
    } catch (error) {
        console.log("UserData", error)
    }
}









exports.AddCategory = async (req, res, next) => {
    try {res.locals.message=req.flash();
        if (!req.query.id) {
            await AddCategory(req, res)
            req.flash("success","update item succesfully")
        } else {
            await AddCategory(req, res, req.query.id)
            req.flash("success","update item succesfully")
        }
    } catch (error) {
        console.log("UserData", error)
    }
}
exports.ViwesCategory = async (req, res) => {
    try {console.log("req.user",req.user)
        let condition = {}
        // let limit = req.query.length;
        // let start = req.query.start;
        if (req.query.id) {
            condition = { parent_Name: req.query.id};
        } else {
            condition = { parent_Name: null };
        }
       
        let data = await CategoryModule.find(condition)

        let dele;
        for (const item of data) {
            const FindData = await CategoryModule.find({ parent_Name: item._id })
            // console.log("index", i, FindData.length)
            // i++
            if (FindData.length > 0) {

                dele = `view`

            } else {

                dele = `delete`
            }
            item._doc.del = dele
            dele = ""


        }
        console.log("dara", data)
        res.render("addcategory/views_category", { data, user: req.user })

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
    try {
        const user = req.user
        _id = req.query.id
        // console.log("req.params.id", _id);
        if (_id) {
            const update_data = await CategoryModule.find({ _id })
            // console.log("edit_category", update_data)
            if (update_data) {
                res.render("addcategory/edit_category", { update_data, user });
            }
        }
    } catch (error) {
        console.log("UserData", error)
    }
}
exports.delete_category = async (req, res) => {
    try {res.locals.message=req.flash();
       let  _id = req.query.id
       
        
        const result = await CategoryModule.findByIdAndRemove({ _id });
        if (result) {
            
            req.flash("success","delete item successfully")
                res.redirect(`/view-category`)
            
        }
        else
        {req.flash("success","delete item successfully")
            res.redirect(`/view-category`)
        }
        

    } catch (error) {
        console.log("UserData", error)
    }
}
exports.sub_category = async (req, res) => {
    try { const user = req.user
        // console.log("req.query", req.query, "jj", req.params)
        if (req.query.id) {
            _id = mongoose.Types.ObjectId(req.query.id)
            const findcategory = await CategoryModule.find({ _id })
            console.log("findcategory",findcategory)
            res.render("addcategory/create_sub_category", { findcategory,user })
        } else {

            console.log("findcategoryout",findcategory)
            const findcategory = await CategoryModule.find({ parent_Name: null })
            res.render("addcategory/create_sub_category", { findcategory,user })
        }
    } catch (error) {
        console.log(error)
    }
}

exports.add_sub_category = async (req, res) => {
    try {res.locals.message=req.flash();
        req.body.image = req.file.filename
        // console.log("add_sub_category req.body", req.body)
        await add_sub_categorys(req, res);
        req.flash("success","subcategory add successfully")
    } catch (error) {
        console.log(error)
    }
}
exports.viwes_sub_category = async (req, res) => {
    try {const user = req.user
        let _id = req.params.id
        // console.log(req.params.id)
        res.render("viwes_sub_category", { _id,user })
    } catch (error) {
        console.log(error)
    }
}
exports.viwes_sub_categorys = async (req, res) => {
    try {
        // console.log("22", req.params.id)
        let start = Number(req.query.start);
        let limit = Number(req.query.length);
        let condition
        if (req.params.id != undefined && req.params.id.length == 24) {
            condition = [
                {
                    $match: {
                        parent_Name: mongoose.Types.ObjectId(req.params.id)
                    },
                },
                {
                    $lookup: {
                        from: "categories",
                        localField: "parent_Name",
                        foreignField: "_id",
                        as: "parent",
                    },
                }, {
                    $unwind: {
                        path: "$parent",
                    },
                },
                {
                    $skip: start
                },
                {
                    $limit: limit
                },
            ]
        } else {
            condition = [
                {
                    $match: {
                        parent_Name: {
                            $ne: null,
                        },
                    },
                },
                {
                    $lookup: {
                        from: "categories",
                        localField: "parent_Name",
                        foreignField: "_id",
                        as: "parent",
                    },
                }, {
                    $unwind: {
                        path: "$parent",
                    },
                },
                {
                    $skip: start
                },
                {
                    $limit: limit
                },
            ]
        }

        CategoryModule.countDocuments({ parent_Name: { $ne: null } }).exec(async (err, row) => {
            if (err) console.log(err);
            let newData = row
            let data = [];
            let count = 1;
            await CategoryModule.aggregate(condition).exec(async (err, row1) => {
                for await (const index of row1) {
                    const FindData = await CategoryModule.find({ parent_Name: index._id })
                    // console.log("index", FindData.length)

                    let dele;
                    if (FindData.length > 0) {
                        dele = `<a href="/view-category/?id=${index._id}"> view</a>    ||  <a href="/add/${index._id}"> Add Sub category</a>`
                    } else {
                        dele = `<a href="/delete/${index._id}">delete</a>    ||  <a href="/add/${index._id}"> Add Sub category</a>`
                    }
                    data.push({
                        "count": count,
                        "Name": index.Name,
                        "image": `<img src="/uploads/${index.image}" alt="Girl in a jacket" width="50" height="60">`,
                        "parent_Name": index.parent.Name,
                        "Action": `<a href="/edit/${index._id}">Edit</a> || ${dele}`,

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
        console.log(error)
    }
}
