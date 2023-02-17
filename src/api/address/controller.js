const saloonservice = require("../saloonService/model")
const mongoose = require("mongoose");
const cart = require("../cart/model")
const userAddress = require("./model")

exports.addUserAddress = async ({ user, body }) => {
    try {
        let obj = {};
        let location = {};
        const findData = await userAddress.find({ userId: user._id });

        for (const item of findData) {
            if (body.state == item.location.state) {
                if (body.city == item.location.city) {
                    if (body.pincode == item.location.pincode) {
                        if (body.aria == item.location.aria) {
                            if (body.houseNumber == item.location.houseNumber) {
                                return {
                                    statusCode: 200,
                                    status: true,
                                    message: "address-is allready in data base  !",
                                    data: [item]
                                };
                            };
                        };
                    };
                };
            };
        };

        if (user._id) {
            obj.userId = user._id;
        };

        if (body.houseNumber) {
            location.houseNumber = body.houseNumber;
        };

        if (body.aria) {
            location.aria = body.aria;
        };

        if (body.pincode) {
            location.pincode = body.pincode;
        };

        if (body.city) {
            location.city = body.city;
        };

        if (body.state) {
            location.state = body.state;
        };

        if (location) {
            obj.location = location;
        };

        let address = new userAddress(obj);
        const result = await address.save();
        if (result) {
            return {
                statusCode: 200,
                status: true,
                message: "address-Succesfuuly added !",
                data: [result]
            };
        };
    } catch (error) {
        console.log(error);
        throw error;
    };
};

exports.getUserAddress = async ({ user, query }) => {
    try {
        if (query.id) {
            let _id = mongoose.Types.ObjectId(query.id);
            const findData = await userAddress.findOne({ _id });
            if (findData) {
                return {
                    statusCode: 200,
                    status: true,
                    message: "Address-Found-Succesfuuly !",
                    data: findData
                };
            } else {
                return {
                    statusCode: 400,
                    status: false,
                    message: "Please-Enter-Valid-Id !",
                    data: findData
                };
            };
        } else {
            const findData = await userAddress.find({ userId: user._id });
            if (findData.length > 0) {
                return {
                    statusCode: 200,
                    status: true,
                    message: "Address-Found-Succesfuuly !",
                    data: findData
                };
            } else {
                return {
                    statusCode: 400,
                    status: false,
                    message: "No-address-Found !",
                    data: findData
                };
            };
        };
    } catch (error) {
        console.log(error);
        throw error;
    };
};
