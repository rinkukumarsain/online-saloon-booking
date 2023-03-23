const mongoose = require("mongoose");
const cart = require("../cart/model");
const userAddress = require("./model");

exports.addUserAddress = async ({ user, query, body }) => {
    try {
        console.log("body", body)
        let obj = {};
        let location = {};
        const findData = await userAddress.find({ userId: user._id });

        if (user._id) {
            obj.userId = user._id;
        };

        if (body.houseNumber != undefined && body.houseNumber != "") {
            location.houseNumber = body.houseNumber;
        };

        if (body.aria != undefined && body.aria != "") {
            location.aria = body.aria;
        };

        if (body.pincode != undefined && body.pincode != "") {
            location.pincode = body.pincode;
        };

        if (body.city != undefined && body.city != "") {
            location.city = body.city;
        };

        if (body.state != undefined && body.state != "") {
            location.state = body.state;
        };

        if (location != undefined && location != "") {
            obj.location = location;
        };
        if (body.type != undefined && body.type != "") {
            obj.type = body.type;
        };
        console.log("obj", obj)
        if (query.id != undefined && query.id != "") {
            const result = await userAddress.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(query.id) }, obj, { new: true })
            if (result) {
                return {
                    statusCode: 200,
                    status: true,
                    message: "address-update-Succesfuuly  !",
                    data: [result]
                };
            };
        } else {
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
        };
    } catch (error) {
        console.log(error);
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
    };
};

exports.addAddresssInUserCart = async ({ user, query }) => {
    try {
        if (query.id) {
            const _id = mongoose.Types.ObjectId(query.id);
            const findAddress = await userAddress.findOne({ _id });
            if (findAddress) {
                const findCart = await cart.findOne({ userId: user._id });
                if (findCart) {
                    if (findCart.cartdata.length > 0) {
                        const result = await cart.findByIdAndUpdate({ _id: findCart._id }, { $set: { addressId: findAddress._id } }, { new: true });
                        if (result) {
                            return {
                                statusCode: 200,
                                status: true,
                                message: "address added Succesfuuly in cart !",
                                data: [result]
                            };
                        } else {
                            return {
                                statusCode: 200,
                                status: true,
                                message: "not address update in cart !",
                                data: []
                            };
                        };
                    } else {
                        return {
                            statusCode: 200,
                            status: true,
                            message: "your cart is empty please add service  !",
                            data: [findCart]
                        };
                    };
                } else {
                    return {
                        statusCode: 200,
                        status: true,
                        message: "please register cart !",
                        data: [findCart]
                    };
                };
            } else {
                return {
                    statusCode: 200,
                    status: true,
                    message: "Address-Not-Found-please enter valide Id !",
                    data: findAddress
                };
            };
        } else {
            return {
                statusCode: 200,
                status: true,
                message: "give me valide address id !",
                data: ""
            };
        };
    } catch (error) {
        console.log(error);
    };
}



exports.deleteAddress = async ({ user, query }) => {
    try {
        console.log("delete-address")
        if (query.id) {
            const findAndDelete = await userAddress.findByIdAndDelete({ _id: mongoose.Types.ObjectId(query.id) });
            if (findAndDelete) {
                return {
                    statusCode: 200,
                    status: true,
                    message: "address delete Succesfuuly !",
                    data: [findAndDelete]
                };
            } else {
                return {
                    statusCode: 400,
                    status: false,
                    message: "samething is wronge !",
                    data: []
                };
            };
        } else {
            return {
                statusCode: 400,
                status: false,
                message: "Enter valide id !",
                data: []
            };
        };
    } catch (error) {
        console.log(error);
    };
};