const saloonService = require("./model");
const saloonstore = require("../saloonstore/model")
const category = require("../category/model")
const mongoose = require("mongoose");
const service = require("../saloonService/model")

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

        if (query.id) {
            let _id = mongoose.Types.ObjectId(query.id);

            if (file) {
                imgs.push(`http://159.89.164.11:7070/uploads/${file.filename}`);
            };

            if (imgs.length > 0) {
                obj.image = imgs;
            };

            if (body.ServiceName) {
                obj.ServiceName = body.ServiceName;
            };
            if (body.ServicePrice) {
                obj.ServicePrice = body.ServicePrice;
            };
            if (body.description) {
                obj.description = body.description;
            };
            if (body.timePeriod) {
                obj.timePeriod_in_minits = body.timePeriod;
            };
            if (body.serviceProvider) {
                obj.serviceProvider = body.serviceProvider;
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
            if (body.saloonStore) {
                let saloonStore = mongoose.Types.ObjectId(body.saloonStore);
                const findstore = await saloonstore.findOne({ _id: saloonStore });
                if (findstore) {
                    if (body.ServiceName) {
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
            if (file) {
                imgs.push(`http://159.89.164.11:7070/uploads/${file.filename}`);
            };
            if (imgs.length > 0) {
                obj.image = imgs;
            } else {
                obj.image = "";
            };
            if (body.ServicePrice) {
                obj.ServicePrice = body.ServicePrice;
            };
            if (body.description) {
                obj.description = body.description;
            };
            if (body.saloonStore) {
                obj.saloonStore = body.saloonStore;
            };
            if (body.timePeriod) {
                obj.timePeriod_in_minits = body.timePeriod;
            };
            if (body.serviceProvider) {
                obj.serviceProvider = body.serviceProvider;
            };

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


exports.getAllSaloonServiceByCatogory = async ({ query }) => {
    try {
        let arrr = []
        let final = []
        let arr = {};
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
        if (query.id) {
            let arrr = []
            let _id = query.id;
            const findCategory = await category.findOne({ _id });
            if (findCategory) {
                const findsubCategory = await category.find({ parent_Name: findCategory._id });
                if (findsubCategory.length > 0) {
                    for (const item of findsubCategory) {
                        const condition = [];
                        condition.push({
                            '$match': {
                                'last_category': item._id
                            }
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

                        condition.push({
                            '$project': {
                                'saloonStore': 1,
                                'storeLOcation': '$result.location',
                                'storeName': '$result.storeName',
                                'ServiceName': 1,
                                'ServicePrice': 1,
                                'image': 1,
                                'description': 1,
                                'last_category': 1,
                                'category': 1,
                                'timePeriod': 1,
                                'timePeriod_in_minits': 1,
                                'serviceProvider': 1,
                                'updatedA': 1
                            }
                        });

                        const findService = await service.aggregate(condition);
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
                            data: arrr
                        };
                    }


                } else {
                    console.log("subcatory not found ")
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