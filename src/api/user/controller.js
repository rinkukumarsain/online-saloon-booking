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
            // const save = await userModel.create(body);
            return {
                statusCode: 200,
                status: false,
                message: "Otp Send",
                data: []
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
                return {
                    statusCode: 200,
                    status: true,
                    message: "Otp Matched",
                    data: []
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
}

exports.otplogin = async ({ body }) => {
    try {
        let user;
        if (body.phone) {
            const findPhone = await userModel.findOne({ phone: body.phone });
            if (data) user = findPhone
        }

        if (user) {
            if (user.otp === body.otp) {
                const token = jwt.sign({ _id: data._id }, process.env.SECRET);
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
}

exports.emailLogin = async ({ body }) => {
    const { email, password, phone } = body
    if (email) {
        const data = await userModel.findOne({ email: body.email });
        if (data) {
            const match = await bcrypt.compare(password, data.password)
            if (match) {
                return {
                    statusCode: 200,
                    status: true,
                    message: "Email Login successfull !",
                    data: []
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
        console.log("data", data)
        if (data) {
            return {
                statusCode: 400,
                status: false,
                message: "Otp Send",
                data: []
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
}

exports.loginOtpVerify = async ({ body }) => {
    const { phone, otp } = body
    const data = await userModel.findOne({ phone });
    if (data) {
        if (otp == data.otp) {
            return {
                statusCode: 400,
                status: false,
                message: "Phone Login successfull !",
                data: []
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
}
