const userModel = require("./model");
const services = require("./services");
const bcrypt = require('bcrypt');
const { query } = require("express");
const jwt = require("jsonwebtoken");
const referralCodeGenerator = require("referral-code-generator");

exports.otpSent = async ({ body }) => {
    try {
        let user;
        if (body.phone != undefined && body.phone != "") {
            const data = await userModel.findOne({ phone: body.phone });
            if (data) user = data;
        } else {
            return {
                statusCode: 400,
                status: false,
                message: "plese Enter number ",
                data: []
            };
        }
        if (user) {
            return {
                statusCode: 400,
                status: false,
                message: "User Already Exists",
                data: []
            };
        } else {
            body.otp = '1234'
            const userData = await userModel(body);
            const result = await userData.save()
            return {
                statusCode: 200,
                status: true,
                message: "Otp Send",
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
            const data = await userModel.findOne({ phone: body.phone });
            if (data) user = data;
        };
        if (user) {
            if (user.otp === body.otp) {
                const data = await userModel.findOneAndUpdate({ phone: body.phone }, { $set: { verify: true } }, { new: true });
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

exports.register = async ({ body, query }) => {
    try {
        const { email, password } = body;
        let user;

        if (email) {
            const data = await userModel.findOne({ email });
            if (data) user = data;
        };
        if (user) {
            return {
                statusCode: 400,
                status: false,
                message: "User Already Exists",
                data: []
            };
        } else {
            if (body.referCode != undefined && body.referCode != "" || query.referCode != undefined && query.referCode != "") {
                let obj = {};
                const findReferAmount = await userModel.findOne({ type: "super-admin" }, { referalDetails: 1 });
                if (findReferAmount.referalDetails.referaType === "point") {
                    obj['userWallet.point'] = findReferAmount.referalDetails.referalAmount;
                } else {
                    obj['userWallet.balance'] = findReferAmount.referalDetails.referalAmount;
                };
                const findData = await userModel.findOneAndUpdate({ $or: [{ referCode: body.referCode }, { referCode: query.referCode }] }, { $inc: obj });
                if (findData) {
                    body.referId = findData._id
                };
            };


            body.password = bcrypt.hashSync(password, 10);
            body.otp = '';
            let j = 2;
            for (let i = 0; i < j; i++) {
                body.referCode = referralCodeGenerator.custom('uppercase', 6, 6, 'Onlinesaloon')
                if (body.referCode) {
                    const findData = await userModel.findOne({ referCode: body.referCode });
                    if (!findData) {
                        break;
                    } else {
                        j++;
                        continue;
                    };
                };
            };

            const user = await userModel.findOneAndUpdate({ phone: body.phone }, { $set: body }, { new: true });

            //user register hone ke baad referel user ka wallte balece badao 

            const token = jwt.sign({ _id: user._id }, process.env.SECRET);
            if (user) {
                return {
                    statusCode: 201,
                    status: true,
                    message: "Registration successfull",
                    data: { auth: token, user }
                };
            };
        };
    } catch (error) {
        console.log(error);
    };
};

/*
exports.otplogin = async ({ body }) => {
    try {
        let user;
        if (body.phone) {
            const findPhone = await userModel.findOne({ phone: body.phone });
            if (findPhone) user = findPhone
        }

        // bhajeo otp

        if (user) {
            if (user.otp === body.otp) {
                const token = jwt.sign({ _id: user._id }, process.env.SECRET);
                body.token = token;
                const loggeduser = await userModel.findOne({ phone: body.phone }, body);
                return {
                    statusCode: 200,
                    status: true,
                    message: "Otp Matched",
                    data: loggeduser
                }
            }
        } else {
            return {
                statusCode: 400,
                status: false,
                message: "User Not Found!",
                data: []
            }
        }
    } catch (error) {
        
    }
}*/

exports.login = async ({ body }) => {
    try {
        const { email, password, phone } = body;
        if (email) {
            const user = await userModel.findOne({ email: body.email });
            if (user) {
                const match = await bcrypt.compare(password, user.password);
                if (match) {
                    const token = jwt.sign({ _id: user._id }, process.env.SECRET);
                    const up = await userModel.findOneAndUpdate({ _id: user._id }, { auth: token }, { new: true });
                    if (up) {
                        return {
                            statusCode: 200,
                            status: true,
                            message: "Login successfull !",
                            data: [user, { auth: token }]
                        };
                    }
                } else {
                    return {
                        statusCode: 400,
                        status: false,
                        message: "Invalid Login  Details !",
                        data: []
                    };
                };
            } else {
                return {
                    statusCode: 400,
                    status: false,
                    message: "Invalid Login  Details !",
                    data: []
                };
            };
        };

        if (phone) {
            const user = await userModel.findOneAndUpdate({ phone: body.phone }, { $set: { otp: "1234" } }, { new: true });
            const data = await userModel.findOne({ phone: body.phone });
            if (data) {
                return {
                    statusCode: 200,
                    status: true,
                    message: "Otp Send",
                    data: [data]
                };
            } else {
                return {
                    statusCode: 400,
                    status: false,
                    message: "Invalid Phone Number Not Matched!",
                    data: []
                };
            };
        };
    } catch (error) {
        console.log(error);
    };
};

exports.loginOtpVerify = async ({ body }) => {
    try {
        const { phone, otp } = body;
        const user = await userModel.findOne({ phone });
        if (user) {
            if (otp == user.otp) {
                const user = await userModel.findOneAndUpdate({ phone: body.phone }, { $set: { otp: "" } }, { new: true });
                const token = jwt.sign({ _id: user._id }, process.env.SECRET);
                if (user) {
                    const up = await userModel.findOneAndUpdate({ _id: user._id }, { auth: token }, { new: true });
                    if (up) {
                        return {
                            statusCode: 200,
                            status: true,
                            message: "Phone Login successfull !",
                            data: [user, { auth: token }]
                        };
                    }
                };
            } else {
                return {
                    statusCode: 400,
                    status: false,
                    message: "Invalid Otp",
                    data: []
                };
            };
        } else {
            return {
                statusCode: 400,
                status: false,
                message: "Invalid Phone Number Not Matched!",
                data: []
            };
        };
    } catch (error) {
        console.log(error);
    };
};

exports.user_Profile = async ({ user, query }) => {
    try {
        if (user) {
            let condition = []
            condition.push({
                '$match': {
                    '_id': user._id
                }
            })
            if (query.Transaction != undefined && query.Transaction != "") {
                condition.push({
                    '$lookup': {
                        'from': 'refertransactions',
                        'localField': '_id',
                        'foreignField': 'userId',
                        'pipeline': [
                            {
                                '$lookup': {
                                    'from': 'refers',
                                    'localField': 'referPlanId',
                                    'foreignField': '_id',
                                    'as': 'referPlanId'
                                }
                            }, {
                                '$unwind': {
                                    'path': '$referPlanId'
                                }
                            }, {
                                '$replaceRoot': {
                                    'newRoot': '$referPlanId'
                                }
                            }
                        ],
                        'as': 'referTransactions'
                    }
                })
            }
            const FindData = await userModel.aggregate(condition)
            return {
                statusCode: 200,
                status: true,
                message: "user-Profile !",
                data: FindData
            };
        };
    } catch (error) {
        console.log(error);
    };
};

exports.userEditProfile = async ({ body, user, file }) => {
    try {
        let obj = {};
        if (body.name) {
            obj.name = body.name;
        };
        if (body.phone) {
            obj.phone = body.phone;
        };
        if (body.email) {
            obj.email = body.email;
        };
        if (body.gender) {
            obj.gender = body.gender;
        };
        if (body.dateOfBirth) {
            obj.dateOfBirth = body.dateOfBirth;
        };
        if (file) {
            obj.image = `http://159.89.164.11:7070/uploads/${file.filename}`;
        };

        const result = await userModel.findByIdAndUpdate({ _id: user._id }, { $set: obj }, { new: true });
        if (result) {
            return {
                statusCode: 200,
                status: true,
                message: "User Profile Update successfull !",
                data: [result]
            };
        } else {
            return {
                statusCode: 400,
                status: false,
                message: "User Profile Not Update !",
                data: []
            };
        };
    } catch (error) {
        console.log(error);
    };
};

exports.logOut = async (req, res) => {
    try {
        if (req.cookies != undefined && req.cookies) {
            res.clearCookie("", 'token', { expires: new Date(0) });
        };
        return {
            statusCode: 200,
            status: true,
            message: "User log-Out successfull !",
            data: []
        };
    } catch (error) {
        console.log(error);
    };
};


exports.EditUserProfile = async ({ user, file }) => {
    try {
        if (file.filename != undefined && file.filename != "") {

            const result = await userModel.findByIdAndUpdate({ _id: user._id }, { image: `http://159.89.164.11:7070/uploads/${file.filename}` }, { new: true });
            if (result) {
                return {
                    statusCode: 200,
                    status: true,
                    message: "User Profile Update successfull !",
                    data: [result]
                };
            } else {
                return {
                    statusCode: 400,
                    status: false,
                    message: "User Profile Not Update !",
                    data: []
                };
            };
        } else {
            return {
                statusCode: 400,
                status: false,
                message: "input Profile photo !",
                data: []
            };
        };
    } catch (error) {
        console.log(error);
    };
};