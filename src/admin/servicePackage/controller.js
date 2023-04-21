const mongoose = require("mongoose");
const { getAllSaloonCity } = require("../../api/saloonstore/controller");
const { getCategoryListing } = require("../../api/category/controller")
const saloonService = require("../../api/saloonService/model")
const package = require("./model")
const saloon = require("../../api/saloonstore/model")
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
        const FindService = await saloonService.find({ saloonStore: mongoose.Types.ObjectId(req.query.saloonId), ServicesType: 0 })
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
        req.flash("success", "package edit successfully")
        res.redirect("/")
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
};
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


const { getSaloonStore } = require("../../api/saloonstore/controller")
exports.addNewPackage = async (req, res) => {
    try {
        res.locals.message = req.flash();

        req.query.type = 1
        let iid = req.query.id
        req.query.id = ""
        console.log("package", req.query.saloonId)
        let condition = [];
        if (req.query.saloonId != undefined && req.query.saloonId != "") {
            condition.push({
                '$match': {
                    '_id': mongoose.Types.ObjectId(req.query.saloonId)
                }
            })
        }

        condition.push({
            '$lookup': {
                'from': 'saloonservices',
                'localField': '_id',
                'foreignField': 'saloonStore',
                'as': 'ss'
            }
        }, {
            '$unwind': {
                'path': '$ss',
                // 'preserveNullAndEmptyArrays': true
            }
        }, {
            '$group': {
                '_id': '$_id',
                'fieldN': {
                    '$first': {
                        '_id': '$_id',
                        'storeName': '$storeName'
                    }
                }
            }
        }, {
            '$replaceRoot': {
                'newRoot': '$fieldN'
            }
        })
        const Category = await getCategoryListing(req)
        const salon = await saloon.aggregate(condition)

        console.log("salon.length", salon.length)
        res.render("servicePackage/add_service_package", { user: req.user, data: "", salon, Category, query: req.query })
    } catch (error) {
        console.log(error)
    }
}

exports.newPackageCreate = async (req, res) => {
    try {
        let arr = [];
        for (const item of req.body.Services) {
            let data = JSON.parse(item);
            arr.push(data.id);
        };
        req.body.Services = arr;
        req.body.image = req.file.filename;
        //1 pakege se liye service ke liye 0
        req.body.ServicesType = 1
        console.log(req.body)
        const details = saloonService(req.body);
        const result = await details.save();
        if (result) {
            res.redirect("/view-package");
        };
    } catch (error) {
        console.log(error);
    };
};


exports.viewPackage = async (req, res) => {
    try {
        let pipeline = []
        res.locals.message = req.flash();
        let match = {}
        if (req.query.ServicePrice != undefined && req.query.ServicePrice != "") {
            match.ServicePrice = { $gt: Number(req.query.ServicePrice) }
        }
        if (req.query.ServiceName != undefined && req.query.ServiceName != "") {
            match.ServiceName = { $regex: req.query.ServiceName }
        }

        if (req.query.id != undefined && req.query.id != "") {
            match.saloonStore = mongoose.Types.ObjectId(req.query.id)
        }
        match.ServicesType = 1

        pipeline.push({
            '$match': match
        })

        if (req.user.type == "admin") {
            pipeline.push({
                '$lookup': {
                    'from': 'saloons',
                    'localField': 'saloonStore',
                    'foreignField': '_id',
                    pipeline: [
                        {
                            '$match': {
                                'userId': req.user._id
                            }
                        }
                    ],
                    'as': 'saloon_data'
                }
            })
        } else {
            pipeline.push({
                '$lookup': {
                    'from': 'saloons',
                    'localField': 'saloonStore',
                    'foreignField': '_id',
                    'as': 'saloon_data'
                }
            })
        }

        pipeline.push({
            '$lookup': {
                'from': 'categories',
                'localField': 'category',
                'foreignField': '_id',
                'as': 'last_category_data'
            }
        })
        pipeline.push({
            '$addFields': {
                'saloon_name': {
                    '$getField': {
                        'field': 'storeName',
                        'input': {
                            '$arrayElemAt': [
                                '$saloon_data', 0
                            ]
                        }
                    }
                },
                'last_category_name': {
                    '$getField': {
                        'field': 'Name',
                        'input': {
                            '$arrayElemAt': [
                                '$last_category_data', 0
                            ]
                        }
                    }
                }
            }
        })

        if (req.query.StoreName != undefined && req.query.StoreName != "") {
            pipeline.push({
                '$match': {
                    'saloon_name': {
                        '$regex': req.query.StoreName, $options: 'i'
                    }
                }
            })
        }

        if (req.user.type == "admin") {
            pipeline.push({
                '$match': {
                    'saloon_name': {
                        '$exists': true
                    }
                }
            })
        }

        const data = await saloonService.aggregate(pipeline)
        // console.log("data", data)
        // jj
        res.render("servicePackage/view_servicepp", { query: req.query, user: req.user, data });
    } catch (error) {
        console.log(error);
    };
}
exports.findPackageServices = async (req, res) => {
    try {
        console.log("findPackageServices", req.query)
        const data = await saloonService.aggregate([
            {
                '$match': {
                    '_id': mongoose.Types.ObjectId(req.query.id)
                }
            }, {
                '$lookup': {
                    'from': 'saloonservices',
                    'localField': 'Services',
                    'foreignField': '_id',
                    'as': 'Services'
                }
            }, {
                '$unwind': {
                    'path': '$Services'
                }
            }, {
                '$replaceRoot': {
                    'newRoot': '$Services'
                }
            }
        ])
        console.log("data", data)
        res.send(data)
    } catch (error) {
        console.log(error);
    };
}