const saloon = require("../../api/saloonstore/model");
const service = require("./services")
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const saloonRequst = require("../../api/Partner/model")
exports.ADD_SALOON = async (req, res) => {
    const _id = req.query.id
    const saloon_data = await saloon.findOne({ _id })
    res.render("add_saloon/add_saloon", { user: req.user, saloon_data })
}

exports.ADD_SALOON_STORE = async (req, res) => {
    try {
        //console.log("body", req.body)
        let { body, user, files, query } = req
        // console.log("body",body)

        // console.log("=====>",files)
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
                if (body.type) { obj.type = body.type }
                if (body.category) { obj.category = body.category }
                if (files.length > 0) {
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
            const { storeName, Email, PhoneNumber, category } = body;
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
            // console.log("body",body)
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
                type: body.type,
                description: body.description,
                userId: body.userId,
                image: body.image,
                category: body.category,
                starting_time: body.starting_time,
                ending_time: body.ending_time,
                startingweek: body.startingweek,
                endingweek: body.endingweek

            });
            const result = await saloon_details.save();
            if (result) {
                req.flash("success", "register-Saloon-Store Succesfuuly !")
                res.redirect("/")
            };
        }
    } catch (error) {
        console.log(error);
    }
}

exports.VIEW_SALOON = async (req, res) => {
    const data = await service.VIEW_SALOON()
    const user = req.user
    res.render("add_saloon/view_saloon", { user, data })
}



exports.DELETE_SALOON = async (req, res) => {
    const id = req.query.id
    await saloon.findByIdAndDelete({ _id: id })
    res.redirect("/view_saloon")
}




exports.GetSaloonAddress = async (req, res) => {
    try {
        const id = req.query.id
        const FindData = await saloon.find({ _id: mongoose.Types.ObjectId(id) })
        if (FindData) {
            res.send(FindData)
        }
    } catch (error) {
        console.log(error)
    }
}



exports.viewsSaloonRequest = async (req, res) => {
    try {
        console.log("req.url viewsSaloonRequest-->stor1", req.url, "<--")
        res.locals.message = req.flash();
        const user = req.user
        const data = await saloonRequst.aggregate([
            {
                '$lookup': {
                    'from': 'users',
                    'localField': 'userId',
                    'foreignField': '_id',
                    'pipeline': [
                        {
                            '$project': {
                                'name': 1
                            }
                        }
                    ],
                    'as': 'result'
                }
            }, {
                '$addFields': {
                    'name': {
                        '$getField': {
                            'field': 'name',
                            'input': {
                                '$arrayElemAt': [
                                    '$result', 0
                                ]
                            }
                        }
                    }
                }
            }
        ])
        res.render("add_saloon/views-saloon-request", { user, data })
    } catch (error) {
        console.log(error)

    }
}


exports.saloonApproval = async (req, res) => {
    try {
        console.log("req.url saloonApproval-->stor1", req.url, "<--")
        console.log("saloonApproval", req.query)
        if (req.query.id != undefined && req.query.id != "") {
            const _id = mongoose.Types.ObjectId(req.query.id)
            const findSloonRequist = await saloonRequst.findOne({ _id })
            console.log("findSloonRequist", findSloonRequist)

            let ovh = {};
            ovh.shopNumber = findSloonRequist.shopNumber
            ovh.aria = findSloonRequist.aria
            ovh.pincode = findSloonRequist.pincode
            ovh.city = findSloonRequist.city
            ovh.state = findSloonRequist.state
            console.log("findSloonRequist", findSloonRequist)

            let saloon_details = new saloon({
                storeName: findSloonRequist.storeName,
                Email: findSloonRequist.Email,
                PhoneNumber: findSloonRequist.PhoneNumber,
                location: {
                    shopNumber: findSloonRequist.location.shopNumber,
                    aria: findSloonRequist.location.aria,
                    pincode: findSloonRequist.location.pincode,
                    city: findSloonRequist.location.city,
                    state: findSloonRequist.location.state,
                },
                description: findSloonRequist.description,
                userId: findSloonRequist.userId,
                image: findSloonRequist.image,
                type: findSloonRequist.type,
                category: findSloonRequist.category,

            });
            const result = await saloon_details.save();
            console.log("result", result)
            if (result) {

                await this.saloonRequistDelete(req, res)
                // console.log("---->", result, " apporove <---")
                // res.redirect("/views-saloon-request")
            };
        } else {
            res.redirect("/views-saloon-request")
        }
    } catch (error) {
        console.log(error);
        ;
    }
}

exports.saloonRequistDelete = async (req, res) => {
    try {
        console.log("req.url saloonRequistDelete-->stor1", req.url, "<--")
        res.locals.message = req.flash();
        console.log(req.url)
        if (req.query.id != undefined && req.query.id != "") {
            const _id = mongoose.Types.ObjectId(req.query.id)
            const findSaloonAndDelete = await saloonRequst.findOneAndDelete({ _id })
            if (findSaloonAndDelete) {
                console.log("res.locals.message", res.locals.message)
                req.flash("success", " request approve succesfully !")
                console.log("res.locals.message", res.locals.message)
                res.redirect("/views-saloon-request")
            }
        } else {
            res.redirect("/views-saloon-request")
        }
    } catch (error) {
        console.log(error);
        ;
    }
}
exports.findAddSaloonRequist = async (req, res) => {
    try {
        const id = req.query.id
        const FindData = await saloonRequst.find({ _id: mongoose.Types.ObjectId(id) })
        if (FindData) {
            res.send(FindData)
        }
    } catch (error) {
        console.log(error)
    }
}