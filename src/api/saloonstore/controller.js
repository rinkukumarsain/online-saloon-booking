const saloon = require("./model");
const mongoose = require("mongoose");

exports.registerSaloonStore = async ({ body, user, file }) => {
    try {
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

        if (file) {
            body.image = file.filename
        } else {
            body.image = ""
        }
        let service_details = new saloon({
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
        });
        const result = await service_details.save();
        if (result) {
            return {
                statusCode: 200,
                status: true,
                message: "register-Saloon-Store Succesfuuly !",
                data: [result]
            };
        };
    } catch (error) {
        console.log(error);
        throw error;
    };
}
