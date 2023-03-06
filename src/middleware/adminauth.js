const jwt = require("jsonwebtoken")
const userModel = require('../api/user/model');

module.exports = async (req, res, next) => {
    try {
        if (req.cookies.accessToken) {
            const token = req.cookies.accessToken
            const { _id } = jwt.verify(token, process.env.accessToken);
            req.user = await userModel.findOneAndUpdate({ _id, auth: token, isDeleted: false }, { new: true })
            if (req.user) {
                next()
                console.log("accessToken ->")
            } else {
                console.log("auth login:")
                res.render("login")
            }
        } else if (req.cookies.refreshToken) {
            console.log("refreshToken ->")
            const varifyRefreshToken = jwt.verify(req.cookies.refreshToken, process.env.refreshToken)
            if (varifyRefreshToken) {
                const accessToken = jwt.sign({ _id: varifyRefreshToken._id }, process.env.accessToken)
                const refreshToken = jwt.sign({ _id: varifyRefreshToken._id }, process.env.refreshToken)

                res.cookie("accessToken", accessToken, {
                    expires: new Date(Date.now() + 1000 * 30),//30 sec 
                    httpOnly: true,
                    overwrite: true
                }).cookie("refreshToken", refreshToken, {
                    expires: new Date(Date.now() + 1000 * 20 * 60),//2 minit
                    httpOnly: true,
                    overwrite: true
                });
                next()
            }
        } else {
            return res.status(401).json({
                status: false,
                message: "Token Not Found accessToken && refreshToken",
                data: []
            })
        }
    } catch (error) {
        console.log("error", error)
        return res.status(401).json({
            status: false,
            message: "Invalid Token",
            data: []
        })
    }
}