const jwt = require("jsonwebtoken")
const userModel = require('../api/user/model');

module.exports = async (req, res, next) => {
    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(" ").pop()
            const { _id } = jwt.verify(token, process.env.SECRET)
            req.user = await userModel.findOneAndUpdate({ _id, auth: token, isDeleted: false }, { new: true })
            if (req.user) {
                next()
            } else {
                return res.status(401).json({
                    status: false,
                    message: "Unauthorized",
                    data: []
                })
            }
        } else {
            return res.status(401).json({
                status: false,
                message: "Token Not Found",
                data: []
            })
        }
    } catch (error) {
        return res.status(401).json({
            status: false,
            message: "Invalid Token",
            data: []
        })
    }
}