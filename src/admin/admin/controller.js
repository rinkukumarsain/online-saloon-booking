// const adminModel = require("../../api/user/model");
// const bcrypt = require('bcrypt')
// const jwt = require("jsonwebtoken")
// exports.registerView = async (req, res) => {
//     try {
//         res.locals.message = req.flash();

//         res.render("register")

//     }
//     catch (error) {
//         console.log(error)
//         throw error
//     }
// }

// exports.loginView = async (req, res) => {
//     try {
//         res.locals.message = req.flash();

//         res.render("login")

//     }
//     catch (error) {
//         console.log(error)
//         throw error
//     }
// }
// exports.dashboardView = async (req, res) => {
//     try {
//         res.locals.message = req.flash();

//         res.render("dashboard")

//     }
//     catch (error) {
//         console.log(error)
//         throw error
//     }
// }


// exports.registerData = async (req, res) => {
//     try {
//         res.locals.message = req.flash();
//         const { name, phone, email, password } = req.body
//         let user;


//         if (email) {
//             const data = await adminModel.findOne({ email })
//             if (data) user = data
//         }
//         if (user) {
//             req.flash("error", "user already exist");
//             res.redirect("/register");
//         } else {

//             req.body.password = bcrypt.hashSync(password, 10)
//             req.body.type = "admin";



//             const user = await adminModel(req.body);
//             await user.save();

//             const token = jwt.sign({ _id: user._id }, process.env.SECRET)
//             req.flash("success", "registration succesfull");
//             res.redirect("/login");



//         }
//     } catch (error) {
//         console.log(error)
//         throw error
//     }
// }
// exports.loginData = async (req, res) => {
//     try {
//         res.locals.message = req.flash();

//         const { email, password } = req.body
//         if (email) {

//             const user = await adminModel.findOne({ email: req.body.email });
//             if (user) {

//                 const match = await bcrypt.compare(password, user.password)

//                 if (match) {

//                     const token = jwt.sign({ _id: user._id }, process.env.SECRET);
//                     res.cookie("jwt", token, {
//                         expires: new Date(Date.now() + 50000000),
//                         httpOnly: true
//                     })

//                     req.flash("success", "login successfully")

//                     res.redirect("/dashboard")


//                 } else {

//                     req.flash("error", "invalid login details");
//                     res.redirect("/login");


//                 }

//             } else {

//                 req.flash("error", "invalid login details");
//                 res.redirect("/login");


//             }
//         }


//     } catch (error) {
//         console.log(error)
//         throw error
//     }
// }