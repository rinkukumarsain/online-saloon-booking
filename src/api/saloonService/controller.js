const saloonService = require("./model");
const saloonstore = require("../saloonstore/model")
const mongoose = require("mongoose");
exports.saloonService = async (req) => {
    try {
        let findData;
        if (req.query.id != undefined && req.query.id) {
            let _id = req.query.id
            findData = await saloonService.find({ _id })
        } else {
            findData = await saloonService.find()
        }

        if (findData.length > 0) {
            return {
                statusCode: 200,
                status: true,
                message: "Product Sent Successfull !",
                data: [findData]
            }
        } else {
            return {
                statusCode: 400,
                status: false,
                message: "No Product !",
                data: []
            }
        }
    } catch (error) {
        console.log(error)
        throw error
    }
}

exports.add_Service = async ({ body, file, query }) => {
    try {
        let obj = {};
        let imgs = [];
        let categorys = [];

        if (query.id) {
            let _id = mongoose.Types.ObjectId(query.id);

            if (file) {
                imgs.push(file.filename);
            };

            if (imgs.length > 0) {
                obj.image = imgs;
            }

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
                obj.serviceProvider = body.serviceProvider
            }

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
                    categorys.push(mongoose.Types.ObjectId(body.category))
                    obj.last_category = categorys;
                    obj.category = categorys;

                } else {
                    body.category.forEach((item) => {
                        categorys.push(mongoose.Types.ObjectId(item))
                    });
                    obj.category = categorys;
                    obj.last_category = body.category[body.category.length - 1];
                }
            };
            if (body.saloonStore) {
                let saloonStore = mongoose.Types.ObjectId(body.saloonStore)
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
                }
            }
            if (file) {
                // file.forEach(element => {
                imgs.push(file.filename);
                // });
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
                obj.saloonStore = body.saloonStore
            }
            if (body.timePeriod) {
                obj.timePeriod_in_minits = body.timePeriod
            }
            if (body.serviceProvider) {
                obj.serviceProvider = body.serviceProvider
            }
            // obj.last_category = body.category[body.category.length - 1];

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
        console.log(error)
        throw error
    }
}