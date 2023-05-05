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
    };
};


exports.getAllSaloonServiceByCatogory = async ({ user, query }) => {
    try {
        let arrr = []
        let final = []
        let arr = {};
        let obj = {}
        let subcotegory;
        let saloonId = mongoose.Types.ObjectId(query.saloonId);
        let findCategory;
        if (query.catogoryId != undefined && query.catogoryId != "") {
            obj._id = mongoose.Types.ObjectId(query.catogoryId);
            findCategory = await category.findOne(obj);
            subcotegory = await category.find({ parent_Name: findCategory._id });

        } else if (query.categoryName) {
            obj.Name = { $regex: query.categoryName, $options: 'i' }
            obj.parent_Name = { $ne: null }
            findCategory = await category.find(obj);
        }
        const findCart = await cart.findOne({ userId: user._id, saloonId })
        const findStore = await saloonstore.findOne({ _id: saloonId });
        if (!findStore) {
            return {
                statusCode: 400,
                status: false,
                message: "please Enter valide saloon Id!",
                data: []
            };
        };
        if (!findCategory) {
            return {
                statusCode: 400,
                status: false,
                message: "please Enter valid categoryId Id!",
                data: []
            };
        } else if (findCategory.length > 0) {
            for await (const element of findCategory) {
                arrr.push(element)
                const findData = await saloonService.find({ saloonStore: saloonId, last_category: element._id });
                if (findData.length > 0) {
                    findData.forEach(index => {
                        if (findCart != null && findCart) {
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
                } else {
                    element._doc.Service = []
                }
            }

            if (arrr) {
                return {
                    statusCode: 200,
                    status: true,
                    message: "Find Data by search name Succesfuuly !",
                    data: arrr
                };
            }

        }

        if (subcotegory.length > 0) {

            findCategory._doc.sub = []
            arrr.push(findCategory)
            arr.Category = findCategory
            for await (const element of subcotegory) {
                const findData = await saloonService.find({ saloonStore: saloonId, last_category: element._id });
                if (findData.length > 0) {
                    findData.forEach(index => {
                        if (findCart != null && findCart) {
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
       
    } catch (error) {
        console.log(error);
    };
};


exports.getServiceByCategory = async ({ query }) => {
    try {
        let obj = {};
        const condition = [];
        if (query.id != undefined && query.id != "") {
            obj.$and = [];
            if (query.ServicePrice_lt != undefined && query.ServicePrice_lt != "" && query.ServicePrice_gt != undefined && query.ServicePrice_gt != "") {
                obj.$and.push({ ServicePrice: { $lte: Number(query.ServicePrice_lt) } },
                    { ServicePrice: { $gte: Number(query.ServicePrice_gt) } });
            };

            if (query.type != undefined && query.type != "" && typeof (query.type) == "string") {
                obj.$and.push({ type: query.type });
            };

            if (typeof (query.type) == "object" && query.type != undefined && query.type != "") {
                obj.$and.push({ type: { $in: query.type } });
            };

            if (query.timePeriod_in_minits != undefined && query.timePeriod_in_minits != "") {
                obj.$and.push({ timePeriod_in_minits: Number(query.timePeriod_in_minits) });
            };


            let arrr = [];

            const findCategory = await category.findOne({ _id: mongoose.Types.ObjectId(query.id) });
            if (findCategory) {
                const findsubCategory = await category.find({ parent_Name: findCategory._id });

                if (findsubCategory.length > 0) {
                    let i = 1;
                    for (const item of findsubCategory) {
                        if (i > 1) {
                            obj.$and.pop()
                        };
                        obj.$and.push({ last_category: item._id });
                        i++;

                        condition.push({
                            '$match': obj
                        });
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

                        if (query.city != undefined && query.city != "") {
                            const findData = await saloonstore.find({ "location.city": query.city })
                            if (findData.length > 0) {
                                condition.push({
                                    '$match': {
                                        'result.location.city': query.city
                                    }
                                });
                            } else {
                                return {
                                    statusCode: 400,
                                    status: false,
                                    message: "please Enter valid city name !",
                                    data: []
                                };
                            }
                        }
                        condition.push({
                            '$project': {
                                'saloonStore': 1,
                                'storeLOcation': '$result.location',
                                'storeName': '$result.storeName',
                                'ServiceName': 1,
                                'ServicePrice': 1,
                                'image': '$result.image',
                                'description': 1,
                                'last_category': 1,
                                'category': 1,
                                'timePeriod': 1,
                                'timePeriod_in_minits': 1,
                                'updatedA': 1,
                                'type': 1
                            }
                        });

                        condition.push({
                            '$group': {
                                '_id': { 'saloonStore': '$saloonStore', 'type': '$type' },
                                'data': {
                                    '$first': {
                                        'saloonStore': '$saloonStore',
                                        'storeLOcation': '$storeLOcation',
                                        'storeName': '$storeName',
                                        'ServiceName': '$ServiceName',
                                        'ServicePrice': '$ServicePrice',
                                        'image': '$image',
                                        'description': '$description',
                                        'last_category': '$last_category',
                                        'category': '$category',
                                        'timePeriod': '$timePeriod',
                                        'timePeriod_in_minits': '$timePeriod_in_minits',
                                        'updatedA': '$updatedA',
                                        'type': '$type'
                                    }
                                }
                            }
                        });

                        if (query.sort != undefined && query.sort != "") {
                            const num = Number(query.sort)
                            condition.push({
                                '$sort': {
                                    'data.ServicePrice': num
                                }
                            });
                        } else {
                            condition.push({
                                '$sort': {
                                    'data.storeName': 1
                                }
                            });
                        }

                        const findService = await saloonService.aggregate(condition);
                        if (findService.length > 0) {
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
    };
};


exports.getSaloonByLocation = async ({ query }) => {
    try {
        let obj = {};
        let condition = [];
        if (query.State != "" && query.State != undefined && !query.city) {
            obj['location.state'] = query.State;
        };
        if (query.city != "" && query.city != undefined && query.State != "" && query.State != undefined) {
            obj["location.state"] = query.State;
            obj["location.city"] = query.city;
        };

        if (query.city != "" && query.city != undefined && !query.State) {
            obj['location.city'] = query.city;
        };
        /* if (query.type != undefined && query.type != "") {
             obj["type"] = query.type;
         };*/
        if (query.type != undefined && query.type != "" && typeof (query.type) == "string") {
            obj.type = query.type
        };

        if (typeof (query.type) == "object" && query.type != undefined && query.type != "") {
            obj.type = { $in: query.type }
        };
        if (obj['location.state'] != undefined && obj['location.state'] != "" || obj['location.city'] != undefined && obj['location.city'] != "") {
            condition.push({
                '$match': obj
            });
        } else {
            return {
                statusCode: 400,
                status: false,
                message: "please Enter Location !",
                data: []
            };
        };
        condition.push({
            '$lookup': {
                'from': 'saloonservices',
                'localField': '_id',
                'foreignField': 'saloonStore',
                'pipeline': [
                    {
                        '$project': {
                            'Price': '$ServicePrice'
                        }
                    }, {
                        '$group': {
                            '_id': null,
                            'data': {
                                '$avg': '$Price'
                            }
                        }
                    }
                ],
                'as': 'sarvice'
            }
        });
        condition.push({
            '$unwind': {
                'path': '$sarvice'
            }
        });
        if (query.ServicePrice_lt != undefined && query.ServicePrice_lt != "" && query.ServicePrice_gt != undefined && query.ServicePrice_gt != "") {
            condition.push({
                '$match': {
                    '$and': [
                        {
                            'sarvice.data': {
                                '$lte': Number(query.ServicePrice_lt)
                            }
                        }, {
                            'sarvice.data': {
                                '$gte': Number(query.ServicePrice_gt)
                            }
                        }
                    ]
                }
            })
        }
        if (query.sort != undefined && query.sort != "") {
            condition.push({
                '$sort': {
                    'sarvice.data': Number(query.sort)
                }
            });
        };
        condition.push({
            '$project': {
                'sarvice': 0
            }
        });

        const findSaloon = await saloonstore.aggregate(condition);
        if (findSaloon.length > 0) {
            return {
                statusCode: 200,
                status: true,
                message: "Saloons find successfull by  Location Name !",
                data: findSaloon
            };
        } else {
            return {
                statusCode: 200,
                status: true,
                message: "data not found !",
                data: findSaloon
            };
        };
    } catch (error) {
        console.log(error);
    };
};