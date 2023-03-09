const adminModel = require("../../api/user/model");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const saloon = require("../../api/saloonstore/model");
const user = require("../../api/user/model")
const saloonRequst = require("../../api/Partner/model");
const { default: mongoose } = require("mongoose");

exports.add_Saloon_View = async (req, res) => {
    try {
        res.locals.message = req.flash();

        res.render("add_saloon")

    }
    catch (error) {
        console.log(error)
        throw error
    }
}

exports.viewssaloonrequest = async (req, res) => {
    try {
        res.locals.message = req.flash();
        const user = req.user
        res.render("views-saloon-request", { user })
    } catch (error) {
        console.log(error)
        throw error
    }
}

exports.saloonAllRequistDatatable = async (req, res) => {
    try {
        saloonRequst.countDocuments().exec(async (err, row) => {
            if (err) console.log(err);
            let newData = row
            let data = [];
            let count = 1;
            await saloonRequst.find().exec(async (err, row1) => {
                for await (const index of row1) {
                    let piture = []

                    index.image.forEach(element => {
                        piture.push(`<img src="/uploads/${element}" alt="pic" width="50" height="60">`)
                    });
                    const findUser = await user.findOne({ _id: index.userId })
                    data.push({
                        "count": count,
                        "storeName": index.storeName,
                        "owerName": findUser.name,
                        "Email": index.Email,
                        "phone": index.PhoneNumber,
                        // "image": piture[0],
                        "shopNumber": index.location.shopNumber,
                        "aria": index.location.aria,
                        "pincode": index.location.pincode,
                        "city": index.location.city,
                        "state": index.location.state,
                        "type": index.type,
                        "category": index.category,
                        "Action": `<a href="/saloon-requist-approval/?id=${index._id}">approval</a> ||<a href="/Delete-Product/${index._id}">delete</a> `,
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

    }
}


exports.saloonApproval = async ({ query }) => {
    try {
        if (query.id != undefined && query.id != "") {
            const _id = mongoose.Types.ObjectId(query.id)
            const findSloonRequist = await saloonRequst.findOne({ _id })
            console.log("findSloonRequist", findSloonRequist)
            this.saloonRegistration(findSloonRequist);
        } else {
            res.redirect("/views-saloon-request")
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}



exports.viewSaloon = async (req, res) => {
    try {
        res.locals.message = req.flash();
        const user = req.user
        res.render("view-saloon", { user })
    } catch (error) {
        console.log(error)
        throw error
    }
}
exports.getSaloonsDataTable = async (req, res) => {
    try {
        let start = Number(req.query.start);
        let limit = Number(req.query.length);
        let condition = {};
        // skip: start
        /*  if (req.user.type == "admin") {
              console.log("admin---=>", req.user)
              // condition.push({
              // '$match': {
              condition.userId = req.user._id
              // }
              console.log("user", condition)
              // })
          } else if (req.user.type == "SuperAdmin") {
              condition = {}
          }*/

        saloon.countDocuments(condition).exec(async (err, row) => {
            if (err) console.log(err);
            let newData = row
            let data = [];
            let count = 1;
            await saloon.find(condition).exec(async (err, row1) => {
                for await (const index of row1) {
                    console.log("row---->", index.storeName)
                    let piture = []

                    index.image.forEach(element => {
                        piture.push(`<img src="/uploads/${element}" alt="pic" width="50" height="60">`)
                    });
                    const findUser = await user.findOne({ _id: index.userId })
                    data.push({
                        "count": count,
                        "storeName": index.storeName,
                        "owerName": findUser.name,
                        "Email": index.Email,
                        "phone": index.PhoneNumber,
                        // "image": piture[0],
                        "shopNumber": index.location.shopNumber,
                        "aria": index.location.aria,
                        "pincode": index.location.pincode,
                        "city": index.location.city,
                        "state": index.location.state,
                        "description": index.description,
                        "Action": `<a href="/Product-registration/${index._id}">Edit</a> ||<a href="/Delete-Product/${index._id}">delete</a> `,
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

exports.saloonRegistration = async (req, res) => {
    try {
        console.log("body", req.body)
        // dfhgfjg
        let { body, user, files, query } = req
        res.locals.message = req.flash();
        if (query.id) {

            let _id = mongoose.Types.ObjectId(query.id);
            const result = await saloon.findOne({ _id });
            if (result) {
                let obj = {};
                let locations = {};
                const match = await bcrypt.compare(body.password, user.password)
                if (match) {

                    if (body.storeName) { obj.storeName = body.storeName };
                    if (body.Email) { obj.Email = body.Email };
                    if (body.PhoneNumber) { obj.PhoneNumber = body.PhoneNumber };
                    if (body.shopNumber) { locations.shopNumber = body.shopNumber };
                    if (body.aria) { locations.aria = body.aria };
                    if (body.pincode) { locations.pincode = body.pincode };
                    if (body.city) { locations.city = body.city };
                    if (body.state) { locations.state = body.state };
                    if (body.fulladdress) { locations.fulladdress = body.fulladdress };
                    if (body.description) { obj.description = body.description };
                    if (body.userId) { obj.userId = body.userId };
                    if (files) {
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
                        // return {
                        //     statusCode: 200,
                        //     status: true,
                        //     message: "Saloon-Store is  Update successfull !",
                        //     data: [result]
                        // };
                    };
                }
                else {
                    req.flash("error", "Saloon-Store is  Update successfull !")
                    res.redirect("/")
                    // return {
                    //     statusCode: 400,
                    //     status: false,
                    //     message: "Password Not Matched",
                    //     data: []
                    // };
                }
            } else {
                req.flash("error", "Saloon-Store is Not Found !")
                res.redirect("/")
                // return {
                //     statusCode: 400,
                //     status: false,
                //     message: "Saloon-Store is Not Found !",
                //     data: [result]
                // };
            };
        } else {
            const { storeName, Email, PhoneNumber } = body;
            body.userId = user._id;
            if (storeName) {
                const result = await saloon.findOne({ storeName });
                if (result) {
                    req.flash("error", "storeName Already Exists")
                    res.redirect("/")

                    // return {
                    //     statusCode: 400,
                    //     status: false,
                    //     message: "storeName Already Exists",
                    //     data: []
                    // };
                };
            };
            if (Email) {
                const result = await saloon.findOne({ Email });
                if (result) {
                    req.flash("error", "Email Already Exists")
                    res.redirect("/")
                    // return {
                    //     statusCode: 400,
                    //     status: false,
                    //     message: "Email Already Exists",
                    //     data: []
                    // };
                };
            };
            if (PhoneNumber) {
                const result = await saloon.findOne({ PhoneNumber });
                if (result) {
                    req.flash("error", "PhoneNumber Already Exists")
                    res.redirect("/")
                    // return {
                    //     statusCode: 400,
                    //     status: false,
                    //     message: "PhoneNumber Already Exists",
                    //     data: []
                    // };
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
                    state: body.state,
                    fulladdress: body.fulladdress

                },
                description: body.description,
                userId: body.userId,
                image: body.image,
            });
            const result = await saloon_details.save();
            if (result) {
                req.flash("success", "register-Saloon-Store Succesfuuly !")
                res.redirect("/")
                //res.send("data add successfully")
                // return {
                //     statusCode: 200,
                //     status: true,
                //     message: "register-Saloon-Store Succesfuuly !",
                //     data: [result]
                // };
            };
        }
    } catch (error) {
        console.log(error);
        throw error;
    };
}
