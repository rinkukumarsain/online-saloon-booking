const mongoose = require("mongoose");
const { getAllSaloonCity } = require("../../api/saloonstore/controller");
const { getCategoryListing } = require("../../api/category/controller");
const saloonService = require("../../api/saloonService/model");
const package = require("./model");

exports.package = async (req, res) => {
    try {
        req.query.type = 1
        let iid = req.query.id
        req.query.id = ""
        const FindCategory = await getCategoryListing(req)
        if (iid != undefined && iid != "") {
            const data = await package.aggregate([{
                '$match': {
                    '_id': mongoose.Types.ObjectId(iid)
                }
            }, {
                '$lookup': {
                    'from': 'saloonservices',
                    'localField': 'Services',
                    'foreignField': '_id',
                    'as': 'saloservices'
                }
            }]);
            const FindService = await saloonService.find({ saloonStore: data[0].saloonId })
            console.log("FindServiceb h", FindService.length)
            if (data) {
                res.render("servicePackage/editindex", { user: req.user, data, Category: FindCategory.data, query: req.query, FindService });
            }
        } else {
            res.render("servicePackage/index", { user: req.user, data: "", Category: FindCategory.data, query: req.query });
        };
    } catch (error) {
        console.log(error);
    };
};




exports.FindServiceForPackages = async (req, res) => {
    try {
        console.log("FindServiceForPackages", req.query.saloonId)
        const FindService = await saloonService.find({ saloonStore: mongoose.Types.ObjectId(req.query.saloonId), $or: [{ type: "unisex" }, { type: "male" }] })
        console.log("FindService.length", FindService.length)
        // f
        res.send(FindService)
    } catch (error) {
        console.log(error);
    };
};

exports.CreatePackage = async (req, res) => {
    try {
        res.locals.message = req.flash();
        let arr = [];
        for (const item of req.body.Services) {
            let data = JSON.parse(item)
            arr.push(data.id)
        };
        req.body.Services = arr
        req.body.saloonId = req.query.saloonId
        console.log("req", req.query)
        const pakegeDetail = new package(req.body)
        const result = await pakegeDetail.save()

        if (result) {
            req.flash("success", "package Createed successfully");
            res.redirect("/view-service-Package");
        } else {
            req.flash("error", "samething is wroung ");
            res.redirect("/");
        }
    } catch (error) {
        console.log(error);
    };
};


exports.packageEdit = async (req, res) => {
    console.log("packageEdit")
}

exports.viewServicePackage = async (req, res) => {
    try {
        res.locals.message = req.flash();
        let condition = []

        if (req.query.id != undefined && req.query.id != "") {
            condition.push({
                '$match': {
                    'saloonId': mongoose.Types.ObjectId(req.query.id)
                }
            })
        };
        condition.push({
            '$lookup': {
                'from': 'saloons',
                'localField': 'saloonId',
                'foreignField': '_id',
                'pipeline': [
                    {
                        '$project': {
                            'storeName': 1
                        }
                    }
                ],
                'as': 'saloonNmae'
            }
        }, {
            '$lookup': {
                'from': 'categories',
                'localField': 'PackageCotegory',
                'foreignField': '_id',
                'pipeline': [
                    {
                        '$project': {
                            'Name': 1
                        }
                    }
                ],
                'as': 'Cotegory'
            }
        })
        const data = await package.aggregate(condition);

        res.render("servicePackage/view_service_Package", { query: req.query, user: req.user, data });
    } catch (error) {
        console.log(error);
    };
};

//sahil view package
/*
exports.viewServicePackageparticular = async (req, res) => {
    try {
        res.locals.message = req.flash();
        const data = await package.aggregate([{
            '$match': {
                'saloonId': mongoose.Types.ObjectId(req.query.id)
            }
        },
        {
            '$lookup': {
                'from': 'saloons',
                'localField': 'saloonId',
                'foreignField': '_id',
                'pipeline': [
                    {
                        '$project': {
                            'storeName': 1
                        }
                    }
                ],
                'as': 'saloonNmae'
            }
        }
        ]);
        console.log("data", data)

        res.render("servicePackage/viewServicePackageparticular", { query: req.query, user: req.user, data });
    } catch (error) {
        console.log(error);
    };
};*/
//sahil view package end
exports.deletePackage = async (req, res) => {
    try {
        if (req.query.id != undefined && req.query.id != "") {
            const updateData = await package.findByIdAndDelete({ _id: mongoose.Types.ObjectId(req.query.id) })
            if (updateData) {
                res.redirect("/view-service-Package");
            };
        } else {
            res.redirect("/");
        }
    } catch (error) {
        console.log(error);
    };
};


exports.FindPackageService = async (req, res) => {
    try {
        const data = await package.aggregate(
            [{
                '$match': {
                    _id: mongoose.Types.ObjectId(req.query.id)
                }
            },
            {
                '$lookup': {
                    'from': 'saloons',
                    'localField': 'saloonId',
                    'foreignField': '_id',
                    'as': 'saloon'
                }
            }, {
                '$lookup': {
                    'from': 'saloonservices',
                    'localField': 'Services',
                    'foreignField': '_id',
                    'as': 'Service'
                }
            }
            ])
        console.log("data", data)
        res.send(data)
    } catch (error) {
        console.log(error);
    };
};
/*
exports.ViewAllCoupon = async (req, res) => {
    try {
        let serchobj = {};
        let searchobj = {};
        if (req.query.amount) {
            searchobj.Amount = req.query.amount;
            serchobj.Amount = { $gte: req.query.amount };
        }
        if (req.query.title) {
            searchobj.Title = req.query.title;
            serchobj.Title = { $regex: req.query.title, $options: "i" };
        }
        if (req.query.coupon) {
            searchobj.CouponCode = req.query.coupon
            serchobj.CouponCode = { $regex: req.query.coupon, $options: "i" };
        }
        if (req.query.enddate) {
            searchobj.EndDate = req.query.enddate;
            serchobj.EndDate = req.query.enddate
        }
        if (req.query.startdate) {
            searchobj.StartDate = req.query.startdate
            serchobj.StartDate = req.query.startdate
        }
        const updateData = await coupon.find(serchobj);
        res.render("Coupon/view-View-Coupon", { user: req.user, data: updateData, filter: req.query, searchobj });
    } catch (error) {
        console.log(error);
    };
};



*/
