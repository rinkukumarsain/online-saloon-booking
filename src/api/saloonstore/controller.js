const saloon = require("./model");
const mongoose = require("mongoose");
const { query } = require("express");
const { error } = require("console");

exports.registerSaloonStore = async ({ body, user, files, query }) => {
    try {
        if (query.id) {
            let _id = mongoose.Types.ObjectId(query.id);
            const result = await saloon.findOne({ _id });
            if (result) {
                let obj = {};
                let locations = {};

                if (body.storeName) { obj.storeName = body.storeName };
                if (body.Email) { obj.Email = body.Email };
                if (body.PhoneNumber) { obj.PhoneNumber = body.PhoneNumber };
                if (body.shopNumber) { locations.shopNumber = body.shopNumber };
                if (body.aria) { locations.aria = body.aria };
                if (body.pincode) { locations.pincode = body.pincode };
                if (body.city) { locations.city = body.city };
                if (body.state) { locations.state = body.state };
                if (body.description) { obj.description = body.description };
                if (user) { obj.userId = user._id };
                if (body.type) { obj.type = body.type };
                if (files) {
                    img = [];
                    files.forEach(element => {
                        img.push(`http://159.89.164.11:7070/uploads/${element.filename}`);
                    });
                    obj.image = img;
                }
                obj.location = locations;
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
            if (files) {
                img = [];
                files.forEach(element => {
                    img.push(`http://159.89.164.11:7070/uploads/${element.filename}`);
                });
                body.image = img;
            } else {
                body.image = "";
            };
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
                type: body.type
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
        throw error;
    };
};

exports.getSaloonStore = async ({ query }) => {
    try {
        let result;
        if (query.id) {
            const _id = query.id;
            result = await saloon.findOne({ _id });
            if (result) {
                return {
                    statusCode: 200,
                    status: true,
                    message: "Get one Saloon-Store successfull !",
                    data: [result]
                };
            };
        } else {
            result = await saloon.find()
            if (result) {
                return {
                    statusCode: 200,
                    status: true,
                    message: "Get All Saloon-Store successfull !",
                    data: [result]
                };
            };
        };
    } catch (error) {
        console.log(error);
        throw error;
    };
};