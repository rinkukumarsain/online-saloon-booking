const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const fs = require("fs");
const userModel = require("../../api/user/model");
const { findByIdAndUpdate } = require('./model');
const path = require("path")

const service = require("./service")

exports.admin = async (req, res) => {
    try {
        if (req.cookies.accessToken) {
            const { _id } = jwt.verify(req.cookies.accessToken, process.env.accessToken)
            const user = await userModel.findOne({ _id })
            res.locals.message = req.flash();
            if (user) {
                // let data = service.AllDetail(req)
                res.render("users/dashboard", { user })
            } else {
                res.locals.message = req.flash();
                res.render("users/login")
            }
        } else {
            res.locals.message = req.flash();
            res.render("users/login")
        }
    } catch (error) {
        console.log(error);
    }
}

exports.register = async (req, res) => {
    try {
        res.locals.message = req.flash();
        res.render("users/register");
    } catch (error) {
        console.log(error);
    };
};

exports.adminRegisterData = async (req, res) => {
    try {
        res.locals.message = req.flash();
        const { name, phone, email, password } = req.body;
        let user;
        if (email) {
            const data = await userModel.findOne({ email });
            if (data) user = data;
        }
        if (user) {
            req.flash("error", "user already exist");
            res.redirect("/register");
        } else {
            req.body.password = bcrypt.hashSync(password, 10);
            req.body.type = "admin";
            const user = await userModel(req.body);
            const result = await user.save();
            if (result) {
                req.flash("success", "registration successful");
                res.redirect("/");
            }
        }
    } catch (error) {
        console.log(error);
    };
};


exports.login = async (req, res) => {
    try {
        res.locals.message = req.flash();
        res.render("users/login");
    } catch (error) {
        console.log(error);
    };
};

exports.loginData = async (req, res) => {
    try {
        res.locals.message = req.flash();
        const { email, password } = req.body;
        if (email) {
            const user = await userModel.findOne({ email: req.body.email });
            if (user) {
                const match = await bcrypt.compare(password, user.password);
                if (match) {
                    const accessToken = jwt.sign({ _id: user._id }, process.env.accessToken);
                    const refreshToken = jwt.sign({ _id: user._id }, process.env.refreshToken);

                    res.cookie("accessToken", accessToken, {
                        expires: new Date(Date.now() + 10000 * 60 * 60),//1 minit
                        httpOnly: true,
                        overwrite: true
                    }).cookie("refreshToken", refreshToken, {
                        expires: new Date(Date.now() + 10000 * 60 * 60 * 12),//10 minit
                        httpOnly: true,
                        overwrite: true
                    });
                    req.flash("success", "login successfully");
                    res.redirect("/");
                } else {
                    req.flash("error", "invalid login details");
                    res.redirect("/");
                };
            } else {
                req.flash("error", "invalid login details");
                res.redirect("/");
            };
        };
    } catch (error) {
        console.log(error);
    };
};
exports.forgetPassword = async (req, res) => {
    try {
        res.render("users/Forget-Password", { user: req.user })
    } catch (error) {
        console.log(error);
    };
}

exports.ForgetPassword = async ({ body, user }, res) => {
    try {
        if (body.Cpassword === body.password) {
            const match = await bcrypt.compare(body.OldPassword, user.password);
            if (match) {
                const pp = await bcrypt.hash(body.password, 10);
                const result = await userModel.findByIdAndUpdate({ _id: user._id }, { password: pp });
                if (result) {
                    res.redirect("/");
                }
            } else {
                res.redirect("/forget-password");
            }

        } else {
            res.redirect("/forget-password");
        }
    } catch (error) {
        console.log(error);
    };
};

exports.usersProfile = async (req, res) => {
    try {
        res.locals.message = req.flash();
        const user = req.user;
        res.render("users/usersProfile", { user });
    } catch (error) {
        console.log(error);
    };
};
exports.add_profile_data = async (req, res) => {
    try {
        let imagepath;
        res.locals.message = req.flash();
        const user = req.user;
        const id = req.query.id;
        let obj = {};
        if (user.image) {
            imagepath = user.image.split("/");
        }

        if (req.body.name) { obj.name = req.body.name }
        if (req.body.phone) { obj.phone = req.body.phone }
        if (req.body.description) { obj.description = req.body.description }
        if (req.file) {
            if (user.image) {
                try {
                    fs.unlinkSync(`${path.join(__dirname, `/../../../public/uploads/${imagepath[4]}`)}`)
                } catch (error) {
                    console.log(error)
                }
            }
            obj.image = `http://159.89.164.11:7070/uploads/${req.file.filename}`
        }
        const updatedata = await userModel.findByIdAndUpdate(id, obj, { new: true });
        req.flash("success", "profile updated successfully")

        res.redirect("/")
    } catch (error) {
        console.log(error);

    };
};


exports.AdminlogOut = async (req, res) => {
    try {
        res.clearCookie("accessToken", 'token', { expires: new Date(0) })
            .clearCookie("refreshToken", 'token', { expires: new Date(0) })
            .redirect("/");
    } catch (error) {
        console.log(error);
    }
}

// const order = require("../../api/order/model")
// exports.orderDetail = async (req, res) => {
//     try {
//         const data = await order.find()
//         res.send(data);
//     } catch (error) {
//         console.log(error);
//     };
// };
