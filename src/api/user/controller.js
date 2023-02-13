const userModel = require("./model");
const services = require("./services");
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")

exports.otpSent = async ({ body }) => {
    try {
        let user;
        if (body.phone) {
            const data = await userModel.findOne({ phone: body.phone });
            if (data) user = data
        }
        if (user) {
            return {
                statusCode: 400,
                status: false,
                message: "User Already Exists",
                data: []
            }
        } else {
            body.otp = '1234'
            const userData = await userModel(body);
            const result = await userData.save()
            return {
                statusCode: 200,
                status: true,
                message: "Otp Send",
                data: [result]
            }

        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

exports.otpVerify = async ({ body }) => {
    try {
        let user;
        if (body.phone) {
            const data = await userModel.findOne({ phone: body.phone });
            if (data) user = data
        }
        if (user) {
            if (user.otp === body.otp) {
                const data = await userModel.findOneAndUpdate({ phone: body.phone }, { $set: { verify: true } }, { new: true });
                return {
                    statusCode: 200,
                    status: true,
                    message: "Otp Matched",
                    data: [data]
                }
            } else {
                return {
                    statusCode: 400,
                    status: false,
                    message: "Otp Not Matched",
                    data: []
                }
            }
        } else {
            return {
                statusCode: 400,
                status: false,
                message: "Phone Number Not Matched!",
                data: []
            }
        }
    } catch (error) {
        console.log(error)
        throw error;
    }
}

exports.register = async ({ body }) => {
    try {
        const { name, phone, email, password } = body
        let user;
        if (phone) {
            const data = await userModel.findOne({ phone })
            if (data) user = data
        }
        if (email) {
            const data = await userModel.findOne({ email })
            if (data) user = data
        }
        if (user) {
            return {
                statusCode: 400,
                status: false,
                message: "User Already Exists",
                data: []
            }
        } else {
            body.password = bcrypt.hashSync(password, 10)
            const user = await userModel(body)
            const token = jwt.sign({ _id: user._id }, process.env.SECRET)
            const saveUser = await user.save()
            return {
                statusCode: 201,
                status: true,
                message: "Registration successfull",
                data: { auth: token, saveUser }
            }
        }
    } catch (error) {
        console.log(error)
        throw error
    }
}
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
        throw error;
    }
}*/

exports.login = async ({ body }) => {
    try {
        const { email, password, phone } = body
        if (email) {
            const user = await userModel.findOne({ email: body.email });
            if (user) {
                const match = await bcrypt.compare(password, user.password)
                if (match) {
                    const token = jwt.sign({ _id: user._id }, process.env.SECRET)
                    return {
                        statusCode: 200,
                        status: true,
                        message: "Login successfull !",
                        data: [user, { auth: token }]
                    }
                } else {
                    return {
                        statusCode: 400,
                        status: false,
                        message: "Invalid Login  Details !",
                        data: []
                    }
                }

            } else {
                return {
                    statusCode: 400,
                    status: false,
                    message: "Invalid Login  Details !",
                    data: []
                }
            }
        }

        if (phone) {
            const data = await userModel.findOne({ phone: body.phone });
            if (data) {

                return {
                    statusCode: 200,
                    status: true,
                    message: "Otp Send",
                    data: [data]
                }
            } else {
                return {
                    statusCode: 400,
                    status: false,
                    message: "Invalid Phone Number Not Matched!",
                    data: []
                }
            }
        }
    } catch (error) {
        console.log(error)
        throw error
    }
}

exports.loginOtpVerify = async ({ body }) => {
    try {
        const { phone, otp } = body
        const user = await userModel.findOne({ phone });
        if (user) {
            if (otp == user.otp) {
                const token = jwt.sign({ _id: user._id }, process.env.SECRET)
                return {
                    statusCode: 400,
                    status: false,
                    message: "Phone Login successfull !",
                    data: [user, { auth: token }]
                }
            } else {
                return {
                    statusCode: 400,
                    status: false,
                    message: "Invalid Otp",
                    data: []
                }
            }
        } else {
            return {
                statusCode: 400,
                status: false,
                message: "Invalid Phone Number Not Matched!",
                data: []
            }
        }
    } catch (error) {
        console.log(error)
        throw error
    }
}
exports.user_Profile = async (req, res) => {
    try {
        if (req.user) {
            return {
                statusCode: 200,
                status: true,
                message: "user-Profile !",
                data: [req.user]
            }
        }
    } catch (error) {
        console.log(error)
        throw error
    }
}

exports.userEditProfile = async ({ body, user, file }) => {
    try {
        let obj = {}
        if (body.name) {
            obj.name = body.name
        }
        if (body.phone) {
            obj.phone = body.phone
        }
        if (body.email) {
            obj.email = body.email
        }
        if (body.gender) {
            obj.gender = body.gender
        }
        if (body.dateOfBirth) {
            obj.dateOfBirth = body.dateOfBirth
        }
        if (file) {
            obj.image = file.filename
        };

        const result = await userModel.findByIdAndUpdate({ _id: user._id }, { $set: obj }, { new: true })
        if (result) {
            return {
                statusCode: 200,
                status: true,
                message: "User Profile Update successfull !",
                data: [result]
            }
        } else {
            return {
                statusCode: 400,
                status: false,
                message: "User Profile Not Update !",
                data: []
            }
        }
    } catch (error) {
        console.log(error)
        throw error
    }

}

exports.logOut = async (req, res) => {
    try {
        if (req.cookies != undefined && req.cookies) {
            res.clearCookie("", 'token', { expires: new Date(0) })
        }

        return {
            statusCode: 200,
            status: true,
            message: "User log-Out successfull !",
            data: []
        }
    } catch (error) {
        console.log(error)
        throw error
    }
}
