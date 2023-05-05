const jwt = require("jsonwebtoken")
const userModel = require('../api/user/model');

module.exports = async (req, res, next) => {
    try {
        if (req.cookies.accessToken != undefined && req.cookies.accessToken != "") {
            const token = req.cookies.accessToken
            const { _id } = jwt.verify(token, process.env.accessToken);

            req.user = await userModel.findOneAndUpdate({ _id }, { auth: token, isDeleted: false }, { new: true })
            if (req.user) {
                next()
            } else {
                res.render("users/login")
            }
        } else if (req.cookies.refreshToken != undefined && req.cookies.refreshToken != "") {
            res.clearCookie("accessToken", 'token', { expires: new Date(0) })
                .clearCookie("refreshToken", 'token', { expires: new Date(0) })
            const varifyRefreshToken = jwt.verify(req.cookies.refreshToken, process.env.refreshToken)
            if (varifyRefreshToken._id != undefined) {
                const accessToken = jwt.sign({ _id: varifyRefreshToken._id }, process.env.accessToken)
                const refreshToken = jwt.sign({ _id: varifyRefreshToken._id }, process.env.refreshToken)

                res.cookie("accessToken", accessToken, {
                    expires: new Date(Date.now() + 1000 * 60 * 5),//30 sec 
                    httpOnly: true,
                    overwrite: true
                }).cookie("refreshToken", refreshToken, {
                    expires: new Date(Date.now() + 1000 * 60 * 30),//2 minit
                    httpOnly: true,
                    overwrite: true
                });
                req.user = await userModel.findOne({ _id: varifyRefreshToken._id })
                if (req.user) {
                    next()
                }
            }
        } else {
            res.redirect("/");
        }
    } catch (error) {
        console.log(error)
        res.redirect("/");
    }
}