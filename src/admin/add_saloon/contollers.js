const saloon = require("../../api/saloonstore/model");
const service = require("./services")
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const saloonRequst = require("../../api/Partner/model")
const { getAllSaloonRequistCity } = require("../../api/saloonstore/controller")




exports.saloonRegister = async (req, res) => {
    const _id = req.query.id
    const saloon_data = await saloon.findOne({ _id })
    res.render("add_saloon/saloon-Register", { user: req.user, saloon_data })
}


const { businessSignUp } = require("../../api/Partner/controller")


exports.ADD_SALOON_STORE = async (req, res) => {
    try {
        // console.log("body", req.body)
        const businessSign = await businessSignUp(req)
        console.log("----------->", businessSign, "<-----------")
        if (businessSign.statusCode == 200 && businessSign.status == true) {
            console.log("next", businessSign.data[0]._id)
            res.redirect(`/business-profile-info?id=${businessSign.data[0]._id}`)
        } else {
            console.log("wroung")

        }
    } catch (error) {
        console.log(error);
    }
}


exports.businessProfileInfo = async (req, res) => {
    try {
        console.log("body", req.body, req.query)
        const _id = mongoose.Types.ObjectId(req.query.id)
        const saloon_data = await saloonRequst.findOne({ _id })
        console.log("saloon_data", saloon_data)
        res.render("add_saloon/business-profile", { _id: req.query.id, user: req.user, saloon_data })
    } catch (error) {
        console.log(error);
    }
}


exports.businessProfile = async (req, res) => {
    try {
        console.log("body", req.body, req.query)

        businessPostjhb
        const _id = req.query.id
        const saloon_data = await saloon.findOne({ _id })
        res.render("add_saloon/business-profile", { user: req.user, saloon_data })
    } catch (error) {
        console.log(error);
    }
}


/*
exports.ADD_SALOON = async (req, res) => {
    const _id = req.query.id
    const saloon_data = await saloon.findOne({ _id })
    res.render("add_saloon/index", { user: req.user, saloon_data })
}
*/



/*
exports.ADD_SALOON_STORE = async (req, res) => {
    try {
        console.log("body", req.body)
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
                if (body.email) { obj.email = body.email };
                if (body.Phone) { obj.Phone = body.Phone };
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
            const { storeName, email, Phone, category } = body;
            body.userId = user._id;
            if (storeName) {
                const result = await saloon.findOne({ storeName });
                if (result) {
                    req.flash("error", "storeName Already Exists")
                    res.redirect("/")
                };
            };
            if (email) {
                const result = await saloon.findOne({ email });
                if (result) {
                    req.flash("error", "email Already Exists")
                    res.redirect("/")
                };
            };
            if (Phone) {
                const result = await saloon.findOne({ Phone });
                if (result) {
                    req.flash("error", "Phone Already Exists")
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
                email: body.email,
                Phone: body.Phone,
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
}*/

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
        res.locals.message = req.flash();
        let condition = [];
        const user = req.user
        let match = {}
        if (req.query.city != undefined && req.query.city != "") {
            match['location.city'] = req.query.city
        }
        if (req.query.Phone != undefined && req.query.Phone != "") {
            match.Phone = { $eq: Number(req.query.Phone) }
        }
        if (req.query.email != undefined && req.query.email != "") {
            match.email = { $regex: req.query.email, $options: 'i' }
        }
        condition.push({
            '$match': match
        })
        condition.push({
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
        )
        const data = await saloonRequst.aggregate(condition)
        const FindAllcity = await getAllSaloonRequistCity(req)
        console.log("data", data)
        if (data && FindAllcity) {
            res.render("add_saloon/views-saloon-request", { user, data, query: req.query, city: FindAllcity.data })
        } else {
            res.redirect("/")
        }
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
                email: findSloonRequist.email,
                Phone: findSloonRequist.Phone,
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
            console.log("FindData", FindData)
            res.send(FindData)
        }
    } catch (error) {
        console.log(error)
    }
}