const saloonService = require("./model");
const saloonstore = require("../saloonstore/model")
const category = require("../category/model")
const mongoose = require("mongoose");
const cart = require("../cart/model")

exports.saloonService = async (req) => {
    try {
        let findData;
        if (req.query.id != undefined && req.query.id) {
            let _id = req.query.id;
            findData = await saloonService.find({ _id });
        } else {
            findData = await saloonService.find();
        };

        if (findData.length > 0) {
            return {
                statusCode: 200,
                status: true,
                message: "Product Sent Successfull !",
                data: [findData]
            };
        } else {
            return {
                statusCode: 400,
                status: false,
                message: "No Product !",
                data: []
            };
        };
    } catch (error) {
        console.log(error);
        throw error;
    };
};

exports.add_Service = async ({ body, file, query }) => {
    try {
        let obj = {};
        let imgs = [];
        let categorys = [];

        if (query.id != undefined && query.id != "") {
            let _id = mongoose.Types.ObjectId(query.id);

            if (file != undefined) {
                imgs.push(`http://159.89.164.11:7070/uploads/${file.filename}`);
            };

            if (imgs.length > 0) {
                obj.image = imgs;
            };

            if (body.ServiceName != undefined && body.ServiceName != "") {
                obj.ServiceName = body.ServiceName;
            };
            if (body.ServicePrice != undefined && body.ServicePrice != "") {
                obj.ServicePrice = body.ServicePrice;
            };
            if (body.description != undefined && body.description != "") {
                obj.description = body.description;
            };
            if (body.timePeriod != undefined && body.timePeriod != "") {
                obj.timePeriod_in_minits = body.timePeriod;
            };
            // if (body.serviceProvider) {
            //     obj.serviceProvider = body.serviceProvider;
            // };
            if (body.type != undefined && body.type != "") {
                obj.type = body.type;
            };

            const result = await saloonService.findByIdAndUpdate({ _id }, { $set: obj }, { new: true });
            if (result) {
                return {
                    statusCode: 200,
                    status: true,
                    message: "Service Update  Succesfuuly !",
                    data: [result]
                };
            };
        } else {
            if (body.category != undefined && body.category.length > 0) {
                if (body.category.length == 24) {
                    categorys.push(mongoose.Types.ObjectId(body.category));
                    obj.last_category = categorys;
                    obj.category = categorys;

                } else {
                    body.category.forEach((item) => {
                        categorys.push(mongoose.Types.ObjectId(item));
                    });
                    obj.category = categorys;
                    obj.last_category = body.category[body.category.length - 1];
                }
            };
            if (body.saloonStore != undefined && body.saloonStore != "") {
                let saloonStore = mongoose.Types.ObjectId(body.saloonStore);
                const findstore = await saloonstore.findOne({ _id: saloonStore });
                if (findstore) {
                    if (body.ServiceName != undefined && body.ServiceName != "") {
                        const findData = await saloonService.find({ saloonStore, ServiceName: body.ServiceName });
                        if (findData.length > 0) {
                            return {
                                statusCode: 400,
                                status: false,
                                message: "ServiceName if All Ready Reagister this store !",
                                data: []
                            };
                        } else {
                            obj.ServiceName = body.ServiceName
                        };
                    };
                } else {
                    return {
                        statusCode: 400,
                        status: false,
                        message: "please Enter valide SaloonStore id !",
                        data: []
                    };
                };
            };
            if (file != undefined) {
                imgs.push(`http://159.89.164.11:7070/uploads/${file.filename}`);
            };
            if (imgs.length > 0) {
                obj.image = imgs;
            } else {
                obj.image = "";
            };
            if (body.ServicePrice != undefined && body.ServicePrice != "") {
                obj.ServicePrice = body.ServicePrice;
            };
            if (body.description != undefined && body.description != "") {
                obj.description = body.description;
            };
            if (body.saloonStore != undefined && body.saloonStore != "") {
                obj.saloonStore = body.saloonStore;
            };
            if (body.timePeriod != undefined && body.timePeriod != "") {
                obj.timePeriod_in_minits = body.timePeriod
            };
            // if (body.serviceProvider) {
            //     obj.serviceProvider = body.serviceProvider;
            // };

            if (body.type != undefined && body.type != "") {
                obj.type = body.type;
            } else {
                return {
                    statusCode: 400,
                    status: false,
                    message: "Enter a saloon Type !",
                    data: [{ "type": "male-female-unisex" }]
                };
            }

            service_details = new saloonService(obj);
            const result = await service_details.save();
            if (result) {
                return {
                    statusCode: 200,
                    status: true,
                    message: "Service Register Succesfuuly !",
                    data: [result]
                };
            };
        };
    } catch (error) {
        console.log(error);
        throw error;
    };
};


exports.getAllSaloonServiceByCatogory = async ({ user, query }) => {
    try {
        let arrr = []
        let final = []
        let arr = {};
        const findCart = await cart.findOne({ userId: user._id })

        let saloonId = mongoose.Types.ObjectId(query.saloonId);
        let categoryId = mongoose.Types.ObjectId(query.catogoryId);
        const findStore = await saloonstore.findOne({ _id: saloonId });
        if (findStore) {
            const findCategory = await category.findOne({ _id: categoryId });
            if (findCategory) {
                findCategory._doc.sub = []
                arrr.push(findCategory)
                arr.Category = findCategory
                const subcotegory = await category.find({ parent_Name: findCategory._id });
                if (subcotegory.length > 0) {
                    for await (const element of subcotegory) {
                        const findData = await saloonService.find({ saloonStore: saloonId, last_category: element._id });

                        if (findData.length > 0) {
                            findData.forEach(index => {
                                if (findCart != null && findCart) {
                                    console.log("findCart", findCart)
                                    let i = 0;
                                    findCart.cartdata.forEach(cart => {
                                        if (index._id.toString() === cart.serviceId.toString()) {
                                            i++
                                        }
                                    });
                                    if (i > 0) {
                                        index._doc.Quantity_In_Cart = i
                                    } else {
                                        index._doc.Quantity_In_Cart = 0
                                    }
                                } else {
                                    index._doc.Quantity_In_Cart = 0
                                }
                            });
                            element._doc.Service = findData
                            arrr[0]._doc.sub.push(element)
                        } else {
                            element._doc.Service = []
                            arrr[0]._doc.sub.push(element)
                        }
                    }
                    if (arrr) {
                        return {
                            statusCode: 200,
                            status: true,
                            message: "Find Data Succesfuuly !",
                            data: arrr
                        };
                    }
                } else {
                    return {
                        statusCode: 400,
                        status: false,
                        message: "subcategory not found!",
                        data: []
                    };
                }
            } else {
                return {
                    statusCode: 400,
                    status: false,
                    message: "invalide categoryId id please Enter valide categoryId Id!",
                    data: []
                };
            };
        } else {
            return {
                statusCode: 400,
                status: false,
                message: "invalide saloon id please Enter valide saloon Id!",
                data: []
            };
        };
    } catch (error) {
        console.log(error);
        throw error;
    };
};


exports.getServiceByCategory = async ({ query }) => {
    try {
        console.log("query--->", query)
        let Ltprice;
        let Gtprice;
        const condition = [];
        if (query.id) {
            if (query.ServicePrice_lt != undefined && query.ServicePrice_lt != "" && query.ServicePrice_gt != undefined && query.ServicePrice_gt != "") {
                Ltprice = Number(query.ServicePrice_lt)
                Gtprice = Number(query.ServicePrice_gt)
            }
            // console.log("ServicePrice_lt", typeof (Ltprice))
            let arrr = []
            let _id = query.id;
            const findCategory = await category.findOne({ _id });
            if (findCategory) {
                const findsubCategory = await category.find({ parent_Name: findCategory._id });
                if (findsubCategory.length > 0) {
                    for (const item of findsubCategory) {

                        if (Ltprice && Gtprice) {
                            if (Ltprice && Gtprice && query.timePeriod_in_minits != undefined && query.timePeriod_in_minits != "") {
                                if (Ltprice && Gtprice && query.timePeriod_in_minits != undefined && query.timePeriod_in_minits != "" && query.type != undefined && query.type != "") {
                                    condition.push({
                                        '$match': {
                                            '$and': [
                                                {
                                                    'last_category': item._id
                                                },
                                                {
                                                    'ServicePrice': {
                                                        '$lte': Ltprice
                                                    }
                                                },
                                                {
                                                    'ServicePrice': {
                                                        '$gte': Gtprice
                                                    }
                                                },
                                                {
                                                    'timePeriod_in_minits': Number(query.timePeriod_in_minits)
                                                }, {
                                                    'type': query.type
                                                }
                                            ]
                                        }
                                    });
                                } else {
                                    console.log("Ltprice && Gtprice query.timePeriod_in_minits")
                                    condition.push({
                                        '$match': {
                                            '$and': [
                                                {
                                                    'last_category': item._id
                                                },
                                                {
                                                    'ServicePrice': {
                                                        '$lte': Ltprice
                                                    }
                                                },
                                                {
                                                    'ServicePrice': {
                                                        '$gte': Gtprice
                                                    }
                                                },
                                                {
                                                    'timePeriod_in_minits': Number(query.timePeriod_in_minits)
                                                },
                                            ]
                                        }
                                    });
                                }
                            } else {
                                console.log("Ltprice && Gtprice")
                                condition.push({
                                    '$match': {
                                        '$and': [
                                            {
                                                'last_category': item._id
                                            },
                                            {
                                                'ServicePrice': {
                                                    '$lte': Ltprice
                                                }
                                            },
                                            {
                                                'ServicePrice': {
                                                    '$gte': Gtprice
                                                }
                                            }
                                        ]
                                    }
                                });
                            }
                        } else if (query.timePeriod_in_minits != undefined && query.timePeriod_in_minits != "") {
                            console.log("query.timePeriod_in_minits0", query.timePeriod_in_minits)
                            const number = Number(query.timePeriod_in_minits)
                            condition.push({
                                '$match': {
                                    '$and': [
                                        {
                                            'last_category': item._id
                                        },

                                        {
                                            'timePeriod_in_minits': number
                                        },
                                    ]
                                }
                            });
                        } else if (query.type != undefined && query.type != "") {
                            console.log("hello", 11, query.type)
                            condition.push({
                                '$match': {
                                    '$and': [
                                        {
                                            'last_category': item._id
                                        },
                                        {
                                            'type': query.type
                                        }
                                    ]
                                }
                            });
                        } else {
                            condition.push({
                                '$match': {
                                    'last_category': item._id
                                }
                            });
                        }

                        condition.push({
                            '$lookup': {
                                'from': 'saloons',
                                'localField': 'saloonStore',
                                'foreignField': '_id',
                                'as': 'result'
                            }
                        });

                        condition.push({
                            '$unwind': {
                                'path': '$result'
                            }
                        });

                        condition.push({
                            '$project': {
                                'saloonStore': 1,
                                'storeLOcation': '$result.location',
                                'storeName': '$result.storeName',
                                'ServiceName': 1,
                                'ServicePrice': 1,
                                'image': "$result.image",
                                'description': 1,
                                'last_category': 1,
                                'category': 1,
                                'timePeriod': 1,
                                'timePeriod_in_minits': 1,
                                // 'serviceProvider': 1,
                                'updatedA': 1,
                                'type': 1
                            }
                        });
                        if (query.sort != undefined && query.sort != "") {
                            const num = Number(query.sort)
                            condition.push({
                                '$sort': {
                                    'ServicePrice': num
                                }
                            })
                        }
                        const findService = await saloonService.aggregate(condition);
                        if (findService) {
                            arrr.push(findService)
                        };
                    }
                    if (arrr && arrr.length > 0) {
                        return {
                            statusCode: 200,
                            status: true,
                            message: "Find Service successfull !",
                            data: arrr
                        };
                    } else {
                        return {
                            statusCode: 400,
                            status: false,
                            message: "Service Not Found   !",
                            data: []
                        };
                    }
                } else {
                    return {
                        statusCode: 400,
                        status: false,
                        message: "subcatory not found !",
                        data: []
                    };
                }

            } else {
                return {
                    statusCode: 400,
                    status: false,
                    message: "Please Enter Valid Category id !",
                    data: []
                };
            };
        } else {
            return {
                statusCode: 400,
                status: false,
                message: "Please Enter Category id !",
                data: []
            };
        };
    } catch (error) {
        console.log(error);
        throw error;
    };
};

exports.getServiceByLocation = async ({ query }) => {
    try {
        let findSaloon;
        if (query.State != "" && query.State != undefined && !query.city) {
            findSaloon = await saloonstore.find({ "location.state": query.State });
            if (findSaloon) {
                return {
                    statusCode: 200,
                    status: true,
                    message: `find saloon By Location City Name ${query.State}!`,
                    data: [findSaloon]
                };
            };
        };
        if (query.city != "" && query.city != undefined && query.State != "" && query.State != undefined) {
            findSaloon = await saloonstore.find({ "location.state": query.State, "location.city": query.city });
            if (findSaloon) {
                return {
                    statusCode: 200,
                    status: true,
                    message: `find saloon By Location City Name ${query.city}!`,
                    data: [findSaloon]
                };
            };
        };

        if (query.city != "" && query.city != undefined) {
            findSaloon = await saloonstore.find({ "location.city": query.city });
            if (findSaloon) {
                return {
                    statusCode: 200,
                    status: true,
                    message: `find saloon By Location City Name ${query.city}!`,
                    data: [findSaloon]
                };
            };
        };
        return {
            statusCode: 400,
            status: false,
            message: "Please Enter Location Name !",
            data: []
        };
    } catch (error) {
        console.log(error);
        throw error;
    };
};