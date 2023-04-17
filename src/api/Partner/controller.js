const service = require("../saloonService/model");
const mongoose = require("mongoose");
const saloonRequst = require("./model");
const saloon = require("../saloonstore/model")
const users = require("../user/model")
const bcrypt = require("bcrypt")

exports.otpSent = async ({ body }) => {
    try {
        console.log("/business-otp-sent", body)
        let user;
        if (body.phone) {
            const data = await users.findOne({ phone: body.phone });
            if (data) user = data;
        };
        if (user) {
            const data = await users.findOneAndUpdate({ phone: body.phone }, { otp: '1234' }, { new: true });
            if (data) {
                return {
                    statusCode: 200,
                    status: true,
                    message: "Otp Send 1",
                    data: [data]
                };
            }
        } else {
            body.otp = '1234'
            const userData = await users(body);
            const result = await userData.save()
            return {
                statusCode: 200,
                status: true,
                message: "Otp Send 2",
                data: [result]
            };
        };
    } catch (error) {
        console.log(error);
    };
};

exports.otpVerify = async ({ body }) => {
    try {
        console.log("body", body)
        let user;
        if (body.phone) {
            const data = await users.findOne({ phone: body.phone });
            if (data) user = data;
        };
        if (user) {
            if (user.otp === body.otp) {
                const data = await users.findOneAndUpdate({ phone: body.phone }, { $set: { verify: true } }, { new: true });
                return {
                    statusCode: 200,
                    status: true,
                    message: "Otp Matched",
                    data: [data]
                };
            } else {
                return {
                    statusCode: 400,
                    status: false,
                    message: "Otp Not Matched",
                    data: []
                };
            };
        } else {
            return {
                statusCode: 400,
                status: false,
                message: "Phone Number Not Matched!",
                data: []
            };
        };
    } catch (error) {
        console.log(error);
    };
};

exports.businessSignUp = async (req) => {
    try {
        const { body, user } = req;
        console.log("body", body, "user", user, "--->", 1.1)
        let { storeName, email, Phone, confromPassword, password } = body;
       

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
        } else {
            return {
                statusCode: 400,
                status: false,
                message: "Enter storeName ",
                data: []
            };
        };

        if (email) {
            const result = await saloon.findOne({ email });
            const result1 = await saloonRequst.findOne({ email });
            if (result || result1) {
                return {
                    statusCode: 400,
                    status: false,
                    message: "email Already Exists",
                    data: []
                };
            };
        } else {
            return {
                statusCode: 400,
                status: false,
                message: "Enter store email ",
                data: []
            };
        };

        if (Phone) {
            const result = await saloon.findOne({ Phone });
            const result1 = await saloonRequst.findOne({ Phone });
            if (result || result1) {
                return {
                    statusCode: 400,
                    status: false,
                    message: "Phone Already Exists",
                    data: []
                };
            };
        } else {
            return {
                statusCode: 400,
                status: false,
                message: "Enter store phone number ",
                data: []
            };
        };

        if (password === confromPassword) {
            body.password = bcrypt.hashSync(password, 10);
        } else {
            return {
                statusCode: 400,
                status: false,
                message: "password not match",
                data: []
            };
        };

        if (!body.ownerName) {
            return {
                statusCode: 400,
                status: false,
                message: "ownerName is must",
                data: []
            };
        };

        if (user != undefined && user._id != undefined && user._id != "") {
            body.userId = user._id;
        } else {
            if (body.email && body.Phone) {
                const findUser = await users.findOne({ email: body.email, phone: body.Phone });
                if (findUser != null) {
                    console.log("user mil gya")
                    body.userId = findUser._id;
                };
            };
            if (body.userId == undefined || body.userId == null) {
                const userData = new users({
                    email: body.email,
                    name: body.ownerName,
                    phone: body.Phone,
                });
                const result = await userData.save();
                if (result) {
                    console.log("user register succes");
                    body.userId = result._id;
                };
            };
        };
        console.log("body", body, "user", user, "--->", 1.2)

        let saloon_details = new saloonRequst({
            storeName: body.storeName,
            email: body.email,
            Phone: body.Phone,
            password: body.password,
            ownerName: body.ownerName,
            userId: body.userId,
            type: body.type,
            category: body.category,
            Partner_Size: body.Partner_Size,
            location: {
                aria: body.aria,
                pincode: body.pincode,
                city: body.city,
                state: body.state,
            },
        });

        const result = await saloon_details.save();
        if (result) {
            console.log("result", result, "--->", 1.3)

            return {
                statusCode: 200,
                status: true,
                message: "Saloon-requist-register Succesfuuly !",
                data: [result]
            };
        } else {
            return {
                statusCode: 400,
                status: false,
                message: "samething is wrong ",
                data: []
            };
        };
    } catch (error) {
        console.log(error);
    };
};

exports.businessProfileInfo = async ({ query, body }) => {
    try {
        console.log("body", body, "query", query, "--->", 2.1)

        if (query.id != undefined && query.id != "") {
            const findData = await saloonRequst.findOne({ _id: mongoose.Types.ObjectId(query.id) })
            if (!findData) {
                return {
                    statusCode: 400,
                    status: false,
                    message: "please Enter valide saloon Id ",
                    data: []
                };
            };
        } else {
            return {
                statusCode: 400,
                status: false,
                message: "please Enter saloon Id ",
                data: []
            };
        };
        console.log("body", body, "query", query, "--->", 2.2)

        const update = await saloonRequst.findOneAndUpdate({ _id: mongoose.Types.ObjectId(query.id) }, { ProfileInfo: body }, { new: true })
        if (update) {
            console.log("update", update, 2.1)

            return {
                statusCode: 200,
                status: true,
                message: "saloonRequst update is Succesfuuly ",
                data: [update]
            };
        } else {
            return {
                statusCode: 400,
                status: false,
                message: "samething is wrong ",
                data: []
            };
        };
    } catch (error) {
        console.log(error);
    };
};



exports.businessBankInfo = async ({ query, body }) => {
    try {
        if (query.id != undefined && query.id != "") {
            const findData = await saloonRequst.findOne({ _id: mongoose.Types.ObjectId(query.id) })
            if (!findData) {
                return {
                    statusCode: 400,
                    status: false,
                    message: "please Enter valide saloon Id ",
                    data: []
                };
            };
        } else {
            return {
                statusCode: 400,
                status: false,
                message: "please Enter saloon Id ",
                data: []
            };
        };

        const update = await saloonRequst.findOneAndUpdate({ _id: mongoose.Types.ObjectId(query.id) }, { BankInfo: body }, { new: true })
        if (update) {
            return {
                statusCode: 200,
                status: true,
                message: "saloonRequst update is Succesfuuly ",
                data: [update]
            };
        } else {
            return {
                statusCode: 400,
                status: false,
                message: "samething is wrong ",
                data: []
            };
        };
    } catch (error) {
        console.log(error);
    };
};




exports.businessUplodeDocument = async (req) => {
    try {
        let obj = {};
        if (req.files.BannerLogo.length > 0) {
            req.files.BannerLogo.forEach(element => {
                obj.BannerLogo = element.filename
            });
        } else {
            return {
                statusCode: 400,
                status: false,
                message: "BannerLogo image is must",
                data: []
            };
        }
        if (req.files.logoImage.length > 0) {
            req.files.logoImage.forEach(element => {
                obj.logoImage = element.filename
            });
        } else {
            return {
                statusCode: 400,
                status: false,
                message: "logoImage image is must",
                data: []
            };
        }
        if (req.files.panImage.length > 0) {
            req.files.panImage.forEach(element => {
                obj.panImage = element.filename
            });
        } else {
            return {
                statusCode: 400,
                status: false,
                message: "panImage image is must",
                data: []
            };
        }
        if (req.files.businessCertificate.length > 0) {
            req.files.businessCertificate.forEach(element => {
                obj.businessCertificate = element.filename
            });
        } else {
            return {
                statusCode: 400,
                status: false,
                message: "businessCertificate image is must",
                data: []
            };
        }

        const update = await saloonRequst.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.query.id) }, { uplodeDocuments: obj }, { new: true })
        if (update) {
            return {
                statusCode: 200,
                status: true,
                message: "saloonRequst update is Succesfuuly ",
                data: [update]
            };
        } else {
            return {
                statusCode: 400,
                status: false,
                message: "samething is wrong ",
                data: []
            };
        };
    } catch (error) {
        console.log(error);
    };
};
