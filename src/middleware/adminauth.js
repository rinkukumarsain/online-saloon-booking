const jwt = require("jsonwebtoken")
const userModel = require('../api/user/model');

module.exports = async (req, res, next) => {
    try {
        if (req.cookies.accessToken) {
            const token = req.cookies.accessToken
            //console.log("access",token)
            const { _id } = jwt.verify(token, process.env.accessToken);
            
            req.user = await userModel.findOneAndUpdate({ _id},{ auth: token, isDeleted: false }, { new: true })
            if (req.user) {
                next()
                
            } else {
                
                res.render("users/login")
                
            }
        } else if (req.cookies.refreshToken) {
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
            res.redirect("/");
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