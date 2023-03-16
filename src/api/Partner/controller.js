const service = require("../saloonService/model");
const mongoose = require("mongoose");
const saloonRequst = require("./model");
const saloon = require("../saloonstore/model")

exports.PartnerRegistrationForm = async (req, res) => {
    try {
        const { body, user, files } = req
        let catogoryarr = []
        const { storeName, Email, PhoneNumber } = body;
        body.userId = user._id;
        if (storeName) {
            const result = await saloon.findOne({ storeName });
            const result1 = await saloonRequst.findOne({ storeName });
            if (result || result1) {
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
            const result1 = await saloonRequst.findOne({ Email });
            if (result || result1) {
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
            const result1 = await saloonRequst.findOne({ PhoneNumber });
            if (result || result1) {
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

        let saloon_details = new saloonRequst({
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

        });
        const result = await saloon_details.save();
        if (result) {
            return {
                statusCode: 200,
                status: true,
                message: "Saloon-requist-register Succesfuuly !",
                data: [result]
            };
        };
    } catch (error) {
        console.log(error);
        
    };
};
