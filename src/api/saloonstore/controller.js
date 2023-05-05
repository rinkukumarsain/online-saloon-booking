const saloon = require("./model");
const mongoose = require("mongoose");
const { query } = require("express");
const { error } = require("console");
const getAllSaloonRequistCity = require("../../api/Partner/model")

exports.registerSaloonStore = async ({ body, user, files, query }) => {
    try {
        let catogoryarr = []
        if (query.id) {
            let _id = mongoose.Types.ObjectId(query.id);
            const result = await saloon.findOne({ _id });
            if (result) {
                let obj = {};
                let locations = {};

                if (body.storeName != undefined && body.storeName != "") { obj.storeName = body.storeName };
                if (body.Email != undefined && body.Email != "") { obj.Email = body.Email };
                if (body.PhoneNumber != undefined && body.PhoneNumber != "") { obj.PhoneNumber = body.PhoneNumber };
                if (body.shopNumber != undefined && body.shopNumber != "") { locations.shopNumber = body.shopNumber };
                if (body.aria != undefined && body.aria != "") { locations.aria = body.aria };
                if (body.pincode != undefined && body.pincode != "") { locations.pincode = body.pincode };
                if (body.city != undefined && body.city != "") { locations.city = body.city };
                if (body.state != undefined && body.state != "") { locations.state = body.state };
                if (body.description != undefined && body.description != "") { obj.description = body.description };
                if (user) { obj.userId = user._id };
                if (body.type != undefined && body.type != "") { obj.type = body.type };
                if (body.TimeRange != undefined && body.TimeRange != "") { obj.TimeRange = body.TimeRange }
                if (body.weekRange != undefined && body.weekRange != "") { obj.weekRange = body.weekRange }

                if (files != undefined && files.length > 0) {
                    img = [];
                    files.forEach(element => {
                        img.push(`http://159.89.164.11:7070/uploads/${element.filename}`);
                    });
                    obj.image = img;
                }
                console.log(body)


                if (typeof (body.category) == "string") {
                    catogoryarr.push(body.category)
                }
                if (typeof (body.category) == "object") {
                    for (const index of body.category) {
                        catogoryarr.push(index)
                    }
                }
                if (locations.city != undefined && locations.city != "") {
                    obj.location = locations;
                }
                const result = await saloon.findByIdAndUpdate({ _id }, { $set: obj }, { new: true });
                if (result) {
                    return {
                        statusCode: 200,
                        status: true,
                        message: "Saloon-Store is  Update successfull !",
                        data: [result]
                    };
                };
            } else {
                return {
                    statusCode: 400,
                    status: false,
                    message: "Saloon-Store is Not Found !",
                    data: [result]
                };
            };
        } else {
            const { storeName, Email, PhoneNumber } = body;
            body.userId = user._id;
            if (storeName) {
                const result = await saloon.findOne({ storeName });
                if (result) {
                    return {
                        statusCode: 400,
                        status: false,
                        message: "storeName Already Exists",
                        data: []
                    };
                };
            };
            if (Email) {
                const result = await saloon.findOne({ Email });
                if (result) {
                    return {
                        statusCode: 400,
                        status: false,
                        message: "Email Already Exists",
                        data: []
                    };
                };
            };
            if (PhoneNumber) {
                const result = await saloon.findOne({ PhoneNumber });
                if (result) {
                    return {
                        statusCode: 400,
                        status: false,
                        message: "PhoneNumber Already Exists",
                        data: []
                    };
                };
            };
            if (files != undefined && files.length > 0) {
                img = [];
                files.forEach(element => {
                    img.push(`http://159.89.164.11:7070/uploads/${element.filename}`);
                });
                body.image = img;
            }
            if (typeof (body.category) == "string") {
                catogoryarr.push(body.category)
            }
            if (typeof (body.category) == "object") {
                for (const index of body.category) {
                    catogoryarr.push(index)
                }
            }

            let saloon_details = new saloon({
                storeName: body.storeName,
                Email: body.Email,
                PhoneNumber: body.PhoneNumber,
                location: {
                    shopNumber: body.shopNumber,
                    aria: body.aria,
                    pincode: body.pincode,
                    city: body.city,
                    state: body.state,
                },
                description: body.description,
                userId: body.userId,
                image: body.image,
                type: body.type,
                category: catogoryarr,
                TimeRange: body.TimeRange,
                weekRange: body.weekRange,
            });
            const result = await saloon_details.save();
            if (result) {
                return {
                    statusCode: 200,
                    status: true,
                    message: "register-Saloon-Store Succesfuuly !",
                    data: [result]
                };
            };
        };
    } catch (error) {
        console.log(error);
    };
};

exports.getSaloonStore = async ({ query }) => {
    try {
        let condition = {};
        if (query.id) {
            condition._id = mongoose.Types.ObjectId(query.id);
        } else {
            condition = {};
        };
        let result = await saloon.find(condition);
        if (result.length > 0) {
            return {
                statusCode: 200,
                status: true,
                message: "Get All Saloon-Store successfull !",
                data: result
            };
        } else {
            return {
                statusCode: 400,
                status: false,
                message: "No Data Found  !",
                data: []
            };
        };
    } catch (error) {
        console.log(error);
    };
};


exports.getAllSaloonCity = async ({ query }) => {
    try {
        const arr = [];
        const category = [];
        let condition = {};
        if (query.category != undefined && query.category != "") {
            category.push(query.category);
            condition.category = { $in: category };
        }
        const findAllSalonn = await saloon.find(condition);
        for (const item of findAllSalonn) {
            if (!arr.includes(item.location.city)) {
                arr.push(item.location.city);
            };
        };
        if (arr.length > 0) {
            return {
                statusCode: 200,
                status: true,
                message: "get All location city !",
                data: arr
            };
        };
    } catch (error) {
        console.log(error);
    };
};


exports.getAllSaloonRequistCity = async ({ query }) => {
    try {
        const arr = [];
        const category = [];
        let condition = {};
        if (query.category != undefined && query.category != "") {
            category.push(query.category);
            condition.category = { $in: category };
        }
        const findAllSalonn = await getAllSaloonRequistCity.find(condition);
        for (const item of findAllSalonn) {
            if (!arr.includes(item.location.city)) {
                arr.push(item.location.city);
            };
        };
        if (arr.length > 0) {
            return {
                statusCode: 200,
                status: true,
                message: "get All location city !",
                data: arr
            };
        };
    } catch (error) {
        console.log(error);
    };
};