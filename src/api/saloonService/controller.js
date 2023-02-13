const saloonService = require("./model");
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
        // if (body._id) {
        if (query._id) {
            let _id = mongoose.Types.ObjectId(body._id);

            if (file != undefined && file.length > 0) {
                file.forEach(element => {
                    imgs.push(element.filename);
                });
            };

            if (imgs.length > 0) {
                obj.image = imgs;
            }// else {
            // obj.image = "file-1675662678559noimg.jpg";
            // };
            if (body.ServiceName) {
                obj.ServiceName = body.ServiceName;
            };
            if (body.ServicePrice) {
                obj.ServicePrice = body.ServicePrice;
            };
            if (body.description) {
                obj.description = body.description;
            };

            // const find = await Product.findByIdAndUpdate({ _id })

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
                body.category.forEach((item) => {
                    console.log("id-----", item);
                    categorys.push(mongoose.Types.ObjectId(item))
                });
                obj.category = categorys;
            };
            if (body.ServiceName) {
                const findData = await saloonService.find({ ServiceName: body.ServiceName });
                if (findData.length > 0) {
                    return {
                        statusCode: 400,
                        status: false,
                        message: "ServiceName if All Ready Reagister !",
                        data: []
                    };
                } else {
                    obj.ServiceName = body.ServiceName
                };
            };
            if (file != undefined && file.length > 0) {
                req.file.forEach(element => {
                    imgs.push(element.filename);
                });
            };
            if (imgs.length > 0) {
                obj.image = imgs;
            } else {
                obj.image = "file-1675662678559noimg.jpg";
            };
            if (body.ServicePrice) {
                obj.ServicePrice = body.ServicePrice;
            };
            if (body.description) {
                obj.description = body.description;
            };
            obj.last_category = body.category[body.category.length - 1];

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