const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const userModel = require("../../api/user/model")

exports.admin = async (req, res) => {
    try {
        if (req.cookies.accessToken) {
            const { _id } = jwt.verify(req.cookies.accessToken, process.env.accessToken)
            const user = await userModel.findOne({ _id })
            res.locals.message = req.flash();
            if (user) {
                res.render("dashboard", { user })
            } else {
                res.locals.message = req.flash();
                res.render("login")
            }
        } else {
            res.locals.message = req.flash();
            res.render("login")
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

exports.register = async (req, res) => {
    try {
        res.locals.message = req.flash();
        res.render("register");
    } catch (error) {
        console.log(error);
        throw error;
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
                req.flash("success", "registration succesfull");
                res.redirect("/");
            }
        }
    } catch (error) {
        console.log(error);
        throw error;
    };
};


exports.login = async (req, res) => {
    try {
        res.locals.message = req.flash();
        res.render("login");
    } catch (error) {
        console.log(error);
        throw error;
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
                        expires: new Date(Date.now() + 1000 * 60 * 30),//1 minit
                        httpOnly: true,
                        overwrite: true
                    }).cookie("refreshToken", refreshToken, {
                        expires: new Date(Date.now() + 1000 * 60 * 60 * 12),//10 minit
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
        throw error;
    };
};

exports.usersProfile = async (req, res) => {
    try {
        res.locals.message = req.flash();
        res.render("usersProfile");
    } catch (error) {
        console.log(error);
        throw error;
    };
};

