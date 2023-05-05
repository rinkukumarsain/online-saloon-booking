const mongoose = require("mongoose");
const { getAllSaloonCity } = require("../../api/saloonstore/controller");
const { getCategoryListing } = require("../../api/category/controller")
const saloonService = require("../../api/saloonService/model")
const package = require("./model")
const saloon = require("../../api/saloonstore/model")

exports.FindServiceForPackages = async (req, res) => {
    try {
        const FindService = await saloonService.find({ saloonStore: mongoose.Types.ObjectId(req.query.saloonId), ServicesType: 0 })
        res.send(FindService)
    } catch (error) {
        console.log(error);
    };
};


exports.deletePackage = async (req, res) => {
    try {
        if (req.query.id != undefined && req.query.id != "") {
            const updateData = await saloonService.findByIdAndDelete({ _id: mongoose.Types.ObjectId(req.query.id) })
            if (updateData) {
                res.redirect("/view-package");
            };
        } else {
            res.redirect("/");
        }
    } catch (error) {
        console.log(error);
    };
};

exports.addNewPackage = async (req, res) => {
    try {
        res.locals.message = req.flash();
        let FindPakage;
        if (req.query.id != undefined && req.query.id != "") {
            FindPakage = await saloonService.findOne({ _id: req.query.id })
            req.query.saloonId = FindPakage.saloonStore
            req.query.id = FindPakage.category[0]

        } else {
            req.query.id = "";
        }

        req.query.type = 1;
        let iid = req.query.id;


        let condition = [];
        if (req.query.saloonId != undefined && req.query.saloonId != "") {
            condition.push({
                '$match': {
                    '_id': mongoose.Types.ObjectId(req.query.saloonId)
                }
            })
        }

        if (req.user.type == "admin") {
            condition.push({
                '$match': {
                    'userId': mongoose.Types.ObjectId(req.user._id)
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
        res.render("servicePackage/add_service_package", { user: req.user, data: FindPakage, salon, Category, query: req.query })
    } catch (error) {
        console.log(error)
    }
}

//1 pakege register

exports.newPackageCreate = async (req, res) => {
    try {
        let arr = [];
        for (const item of req.body.Services) {
            let data = JSON.parse(item);
            arr.push(data.id);
        };
        req.body.Services = arr;
        if (req.file != undefined && req.file != "") {
            req.body.image = req.file.filename;
        };
        req.body.ServicesType = 1
        if (req.query.id != undefined && req.query.id != "") {
            const result = await saloonService.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(req.query.id) }, req.body, { new: true });
            if (result) {
                res.redirect("/view-package");
            };
        } else {
            const details = saloonService(req.body);
            const result = await details.save();
            if (result) {
                res.redirect("/view-package");
            };
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
            match.ServiceName = { $regex: req.query.ServiceName, $options: 'i' }
        }

        if (req.query.FinalPrice != undefined && req.query.FinalPrice != "") {
            match.FinalPrice = { $gt: Number(req.query.FinalPrice) }
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
        if (req.query.CategoryName != undefined && req.query.CategoryName != "") {

            pipeline.push({
                '$lookup': {
                    'from': 'categories',
                    'localField': 'category',
                    'foreignField': '_id',
                    'pipeline': [
                        {
                            '$match': {
                                'Name': {
                                    '$regex': req.query.CategoryName, $options: 'i'
                                }
                            }
                        }
                    ],
                    'as': 'last_category_data'
                }
            })
        } else {
            pipeline.push({
                '$lookup': {
                    'from': 'categories',
                    'localField': 'category',
                    'foreignField': '_id',
                    'as': 'last_category_data'
                }
            })
        }
        pipeline.push({
            '$unwind': {
                'path': '$last_category_data'
            }
        },)

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
                // 'last_category_name': {
                //     '$getField': {
                //         'field': 'Name',
                //         'input': {
                //             '$arrayElemAt': [
                //                 '$last_category_data', 0
                //             ]
                //         }
                //     }
                // }
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
        res.render("servicePackage/view_servicepp", { query: req.query, user: req.user, data });
    } catch (error) {
        console.log(error);
    };
}


exports.findPackageServices = async (req, res) => {
    try {
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
        res.send(data)
    } catch (error) {
        console.log(error);
    };
}