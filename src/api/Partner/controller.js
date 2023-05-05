const service = require("../saloonService/model");
const mongoose = require("mongoose");
const saloonRequst = require("./model");
const saloon = require("../saloonstore/model")
const users = require("../user/model")
const Service = require("./services")

exports.otpSent = async ({ body }) => {
    try {
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

// step 1
exports.businessSignUp = async (req) => {
    try {
        const { body, user, query } = req;
        if (query.id != undefined && query.id != "") {
            const UpdateSaloon = await Service.UpdateSaloon(req)
            if (UpdateSaloon) {
                return UpdateSaloon;
            }
        } else {

            const { storeName, email, Phone, confromPassword, password } = body;

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
                body.password = password;
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
                        body.userId = result._id;
                    };
                };
            };

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
                description: body.description,

            });

            const result = await saloon_details.save();
            if (result) {

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
        }
    } catch (error) {
        console.log(error);
    };
};

// step 2
exports.businessProfileInfo = async ({ query, body }) => {
    try {
        let findData;
        let findSaloonRequst;
        if (query.id != undefined && query.id != "") {
            findSaloonRequst = await saloonRequst.findOne({ _id: mongoose.Types.ObjectId(query.id) })
            const findSaloon = await saloon.findOne({ _id: mongoose.Types.ObjectId(query.id) })
            if (findSaloonRequst) {
                findData = findSaloonRequst
            } else {
                findData = findSaloon
            }
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
        let update;
        if (findSaloonRequst) {
            update = await saloonRequst.findOneAndUpdate({ _id: mongoose.Types.ObjectId(query.id) }, { ProfileInfo: body }, { new: true })
        } else {
            update = await saloon.findOneAndUpdate({ _id: mongoose.Types.ObjectId(query.id) }, { ProfileInfo: body }, { new: true })
        }

        if (update) {

            return {
                statusCode: 200,
                status: true,
                message: " update is Succesfuuly step 2",
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


// step 3
exports.businessBankInfo = async ({ query, body }) => {
    try {
        let findData;
        let findSaloonRequst;
        if (query.id != undefined && query.id != "") {
            findSaloonRequst = await saloonRequst.findOne({ _id: mongoose.Types.ObjectId(query.id) })
            findsaloon = await saloon.findOne({ _id: mongoose.Types.ObjectId(query.id) })
            if (findSaloonRequst) {
                findData = findSaloonRequst
            } else {
                findData = findsaloon
            }
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
        let update;
        if (findSaloonRequst) {
            update = await saloonRequst.findOneAndUpdate({ _id: mongoose.Types.ObjectId(query.id) }, { BankInfo: body }, { new: true })
        } else {
            update = await saloon.findOneAndUpdate({ _id: mongoose.Types.ObjectId(query.id) }, { BankInfo: body }, { new: true })
        }

        if (update) {
            return {
                statusCode: 200,
                status: true,
                message: "update is Succesfuuly step 3",
                data: [update]
            };
        } else {
            return {
                statusCode: 400,
                status: false,
                message: "samething is wrong step 3",
                data: []
            };
        };
    } catch (error) {
        console.log(error);
    };
};



// step 4
exports.businessUplodeDocument = async (req) => {
    try {
        let findData;
        let findSaloonRequst;
        findSaloonRequst = await saloonRequst.findOne({ _id: mongoose.Types.ObjectId(req.query.id) })
        const findSaloon = await saloon.findOne({ _id: mongoose.Types.ObjectId(req.query.id) })
        if (findSaloonRequst) {
            findData = findSaloonRequst
        } else {
            findData = findSaloon
        }

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

        let update;
        if (findSaloonRequst) {
            update = await saloonRequst.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.query.id) }, { uplodeDocuments: obj }, { new: true })
        } else {
            update = await saloon.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.query.id) }, { uplodeDocuments: obj }, { new: true })
        }

        if (update) {
            return {
                statusCode: 200,
                status: true,
                message: "update is Succesfuuly STEP 4",
                data: [update]
            };
        } else {
            return {
                statusCode: 400,
                status: false,
                message: "samething is wrong STEP 4",
                data: []
            };
        };
    } catch (error) {
        console.log(error);
    };
};
