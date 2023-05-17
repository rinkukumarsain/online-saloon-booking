const saloon = require("../../api/saloonstore/model");
const service = require("./services")
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const saloonRequst = require("../../api/Partner/model")
const { getAllSaloonRequistCity, getAllSaloonCity } = require("../../api/saloonstore/controller")
const userm = require("../../api/user/model")




exports.saloonRegister = async (req, res) => {
    try {
        if (req.user.type == "admin") {
            return res.redirect("/")
        }
        res.locals.message = req.flash()
        let saloon_data;
        const find_saloon_data = await saloon.findOne({ _id: mongoose.Types.ObjectId(req.query.id) })
        const find_saloon_requist = await saloonRequst.findOne({ _id: mongoose.Types.ObjectId(req.query.id) })
        if (find_saloon_data) { saloon_data = find_saloon_data }
        if (find_saloon_requist) { saloon_data = find_saloon_requist }
        res.render("add_saloon/saloon-Register", { user: req.user, data: saloon_data })
    } catch (error) {
        console.log(error)
    }
}

const { businessSignUp, businessProfileInfo, businessBankInfo, businessUplodeDocument } = require("../../api/Partner/controller")

// step 1
exports.ADD_SALOON_STORE = async (req, res) => {
    try {
        res.locals.message = req.flash()
      //  console.log("hjvh",req.query,"jh",req.body)
        // jghjhn
        const businessSign = await businessSignUp(req)
        if (businessSign.statusCode == 200 && businessSign.status == true) {
            req.flash("success", businessSign.message)
            res.redirect(`/add_saloon?id=${businessSign.data[0]._id}`)
        } else {
            req.flash("error", businessSign.message)
            res.redirect(`/add_saloon`)
        }
    } catch (error) {
        console.log(error);
    }
}


// step 2
exports.businessProfile = async (req, res) => {
    try {
        res.locals.message = req.flash();
        let find;
        const findSaloonRequst = await saloonRequst.findOne({ _id: mongoose.Types.ObjectId(req.query.id) })
        const findSaloon = await saloon.findOne({ _id: mongoose.Types.ObjectId(req.query.id) })
        if (findSaloonRequst) { find = findSaloonRequst }
        if (findSaloon) { find = findSaloon }
        const businessP = await businessProfileInfo(req)
        if (businessP.statusCode == 200 && businessP.status == true) {
            req.flash("success", businessP.message)
            res.redirect(`/add_saloon?id=${businessP.data[0]._id}`)
        } else {
            req.flash("error", businessP.message)
            res.redirect(`/add_saloon?id=${find._id}`)
        }
    } catch (error) {
        console.log(error);
    }
}

// step 3
exports.businessBankInfoAdmin = async (req, res) => {
    try {
        res.locals.message = req.flash()
        let find;
        const findSaloonRequst = await saloonRequst.findOne({ _id: mongoose.Types.ObjectId(req.query.id) })
        const findSaloon = await saloon.findOne({ _id: mongoose.Types.ObjectId(req.query.id) })
        if (findSaloonRequst) { find = findSaloonRequst }
        if (findSaloon) { find = findSaloon }

        const businessP = await businessBankInfo(req)
        if (businessP.statusCode == 200 && businessP.status == true) {
            req.flash("success", businessP.message)
            res.redirect(`/add_saloon?id=${businessP.data[0]._id}`)
        } else {
            req.flash("error", businessP.message)
            res.redirect(`/add_saloon?id=${find._id}`)
        }
    } catch (error) {
        console.log(error);
    }
}

// step 4
exports.businessUplodeDocumentAdmin = async (req, res) => {
    try {
        res.locals.message = req.flash()
        let find;
        const findSaloonRequst = await saloonRequst.findOne({ _id: mongoose.Types.ObjectId(req.query.id) })
        const findSaloon = await saloon.findOne({ _id: mongoose.Types.ObjectId(req.query.id) })
        if (findSaloonRequst) { find = findSaloonRequst }
        if (findSaloon) { find = findSaloon }

        const businessP = await businessUplodeDocument(req)
        if (businessP.statusCode == 200 && businessP.status == true) {
            res.redirect("/")
        } else {
            req.flash("error", businessP.message)
            res.redirect(`/document-uplode?id=${find._id}`)
        }
    } catch (error) {
        console.log(error);
    }
}

exports.VIEW_SALOON = async (req, res) => {
    try {
        const data = await service.VIEW_SALOON(req)
        const user = req.user
        const city = await saloon.distinct("location.city")
        res.render("add_saloon/view_saloon", { user, data, query: req.query, city })
    } catch (error) {
        console.log(error)
    }
}



exports.DELETE_SALOON = async (req, res) => {
    try {
        const id = req.query.id
        await saloon.findByIdAndDelete({ _id: id })
        res.redirect("/view_saloon")
    } catch (error) {
        console.log(error)
    }
}




exports.GetSaloonAddress = async (req, res) => {
    try {
        const FindData = await saloon.find({ _id: mongoose.Types.ObjectId(req.query.id) })
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
        if (req.query.status != undefined && req.query.status != "") {
            match.status = req.query.status
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
        if (req.query.id != undefined && req.query.id != "") {
            const _id = mongoose.Types.ObjectId(req.query.id)
            const findSloonRequist = await saloonRequst.findOne({ _id })

            let ovh = {};
            ovh.shopNumber = findSloonRequist.shopNumber
            ovh.aria = findSloonRequist.aria
            ovh.pincode = findSloonRequist.pincode
            ovh.city = findSloonRequist.city
            ovh.state = findSloonRequist.state

            let saloon_details = new saloon({
                userId: findSloonRequist.userId,
                storeName: findSloonRequist.storeName,
                ownerName: findSloonRequist.ownerName,
                password: findSloonRequist.password,
                email: findSloonRequist.email,
                Phone: findSloonRequist.Phone,
                location: {
                    aria: findSloonRequist.location.aria,
                    pincode: findSloonRequist.location.pincode,
                    city: findSloonRequist.location.city,
                    state: findSloonRequist.location.state,
                },
                category: findSloonRequist.category,
                status: findSloonRequist.status,
                Partner_Size: findSloonRequist.Partner_Size,
                ProfileInfo: {
                    yourService: findSloonRequist.ProfileInfo.yourService,
                    alternatePhone: findSloonRequist.ProfileInfo.alternatePhone,
                    starting_time: findSloonRequist.ProfileInfo.starting_time,
                    ending_time: findSloonRequist.ProfileInfo.ending_time,
                    workingday: findSloonRequist.ProfileInfo.workingday,
                    FaceBookProfile: findSloonRequist.ProfileInfo.FaceBookProfile,
                    instaProfile: findSloonRequist.ProfileInfo.instaProfile,
                    webProfile: findSloonRequist.ProfileInfo.webProfile,
                    amenities: findSloonRequist.ProfileInfo.amenities,
                },
                BankInfo: {
                    panNo: findSloonRequist.BankInfo.panNo,
                    gstNo: findSloonRequist.BankInfo.gstNo,
                    bankName: findSloonRequist.BankInfo.bankName,
                    branchName: findSloonRequist.BankInfo.branchName,
                    accountNo: findSloonRequist.BankInfo.accountNo,
                    accoutHolder: findSloonRequist.BankInfo.accoutHolder,
                    ifscCode: findSloonRequist.BankInfo.ifscCode,
                    kyc: findSloonRequist.BankInfo.kyc,
                },
                uplodeDocuments: {
                    BannerLogo: findSloonRequist.uplodeDocuments.BannerLogo,
                    logoImage: findSloonRequist.uplodeDocuments.logoImage,
                    panImage: findSloonRequist.uplodeDocuments.panImage,
                    businessCertificate: findSloonRequist.uplodeDocuments.businessCertificate,
                },

            });
            const result = await saloon_details.save();
            if (result) {
                await this.saloonRequistDelete(req, res)
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
        res.locals.message = req.flash();
        if (req.query.id != undefined && req.query.id != "") {
            const _id = mongoose.Types.ObjectId(req.query.id)
            const result = await saloonRequst.findByIdAndDelete({ _id })
            if (result) {
                req.flash("success", " request approvel succesfully !")
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

exports.findSaloonByUser = async (req, res) => {
    try {
        // const finduser = await saloon.aggregate([
        //     {
        //         '$lookup': {
        //             'from': 'users',
        //             'localField': 'userId',
        //             'foreignField': '_id',
        //             'as': 'user'
        //         }
        //     }, {
        //         '$group': {
        //             '_id': '$userId'
        //         }
        //     }
        // ])


        // let arrr = []
        // for (const element of finduser) {
        //     arrr.push(element._id)
        // }
        // const upfate = await userm.updateMany({ _id: { $nin: arrr }, type: { $ne: "block-User" }, type: { $ne: "super-admin" } }, { type: "user" })
        // jghj

        const findSaloon = await saloon.find({ userId: mongoose.Types.ObjectId(req.query.id) })

    } catch (error) {
        console.log(error)
    }
}
exports.FindAdminAllSaloon = async (req, res) => {
    try {
        let data;
        if (req.user.type == "admin") {
            data = await saloon.find({ userId: req.user._id })
        } else {
            data = await saloon.find()
        }
        return res.send(data)
    } catch (error) {
        console.log(error)
    }
}

exports.addImagesInSaloon = async (req, res) => {
    try {
        let arr = [];
        req.files.forEach(element => {
            arr.push(`http://159.89.164.11:7070/uploads/${element.filename}`)
        });
        const result = await saloon.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.query.id) }, { image: arr }, { new: true })
        if (result) {
            res.redirect("/")
        }

    } catch (error) {
        console.log(error)
    }
}
