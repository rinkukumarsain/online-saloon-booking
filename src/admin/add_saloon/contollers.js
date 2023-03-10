const saloon = require("../../api/saloonstore/model");
const service = require("./services")
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
exports.ADD_SALOON = async (req, res) => {
    const user = req.user
    const _id = req.query.id
    const saloon_data = await saloon.findOne({ _id })
    res.render("add_saloon/add_saloon",{user,saloon_data})
}

exports.ADD_SALOON_STORE = async (req, res) => { 
    try {
        console.log("body", req.body)
        let { body, user, files, query } = req

        console.log("=====>",files)
        res.locals.message = req.flash();
        if (query.id) {

            let _id = mongoose.Types.ObjectId(query.id);
            const result = await saloon.findOne({ _id });
            if (result) {
                let obj = {};
                let locations = {};
                    if (body.storeName) { obj.storeName = body.storeName };
                    if (body.Email) { obj.Email = body.Email };
                    if (body.PhoneNumber) { obj.PhoneNumber = body.PhoneNumber };
                    if (body.shopNumber) { locations.shopNumber = body.shopNumber };
                    if (body.aria) { locations.aria = body.aria };
                    if (body.pincode) { locations.pincode = body.pincode };
                    if (body.city) { locations.city = body.city };
                    if (body.state) { locations.state = body.state };
                    if (body.description) { obj.description = body.description };
                if (files.length>0) {
                        console.log("666666")
                        img = []
                        files.forEach(element => {
                            img.push(element.filename)
                        });
                        obj.image = img
                    }
                    obj.location = locations;
                    const result = await saloon.findByIdAndUpdate({ _id }, { $set: obj }, { new: true });
                    if (result) {
                        req.flash("success", "Saloon-Store is  Update successfull !")
                        res.redirect("/")
                    };
               
            } else {
                req.flash("error", "Saloon-Store is Not Found !")
                res.redirect("/")
            };
        } else {
            const { storeName, Email, PhoneNumber,category } = body;
            body.userId = user._id;
            if (storeName) {
                const result = await saloon.findOne({ storeName });
                if (result) {
                    req.flash("error", "storeName Already Exists")
                    res.redirect("/")
                };
            };
            if (Email) {
                const result = await saloon.findOne({ Email });
                if (result) {
                    req.flash("error", "Email Already Exists")
                    res.redirect("/")
                };
            };
            if (PhoneNumber) {
                const result = await saloon.findOne({ PhoneNumber });
                if (result) {
                    req.flash("error", "PhoneNumber Already Exists")
                    res.redirect("/")
                };
            };
            if (files) {
                img = []
                files.forEach(element => {
                    img.push(element.filename)
                });
                body.image = img
            } else {
                body.image = ""
            }
            body.password = bcrypt.hashSync(body.password, 10);
            let saloon_details = new saloon({
                storeName: body.storeName,
                Email: body.Email,
                PhoneNumber: body.PhoneNumber,
                password: body.password,
                location: {
                    shopNumber: body.shopNumber,
                    aria: body.aria,
                    pincode: body.pincode,
                    city: body.city,
                    state: body.state

                },
                description: body.description,
                userId: body.userId,
                image: body.image,
                category:body.category
            });
            const result = await saloon_details.save();
            if (result) {
                req.flash("success", "register-Saloon-Store Succesfuuly !")
                res.redirect("/")
            };
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

exports.VIEW_SALOON = async (req, res) => {
    const data = await service.VIEW_SALOON()
    const user = req.user
    res.render("add_saloon/view_saloon",{user,data})
}



exports.DELETE_SALOON = async (req, res) => {
    const id = req.query.id
    await saloon.findByIdAndDelete({ _id: id })
    res.redirect("/view_saloon")
}