const adminModel = require("../../api/user/model");
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const saloon = require("../../api/saloonstore/model");
exports.registerView = async (req, res) => {
    try {
        res.locals.message = req.flash();

        res.render("register")

    }
    catch (error) {
        console.log(error)
        throw error
    }
}

exports.loginView = async (req, res) => {
    try {
        res.locals.message = req.flash();

        res.render("login")

    }
    catch (error) {
        console.log(error)
        throw error
    }
}
exports.dashboardView = async (req, res) => {
    try {
        res.locals.message = req.flash();

        res.render("dashboard")

    }
    catch (error) {
        console.log(error)
        throw error
    }
}


exports.registerData = async (req, res) => {
    try {
        res.locals.message = req.flash();
        const { name, phone, email, password } = req.body
        let user;


        if (email) {
            const data = await adminModel.findOne({ email })
            if (data) user = data
        }
        if (user) {
            req.flash("error", "user already exist");
            res.redirect("/register");
        } else {

            req.body.password = bcrypt.hashSync(password, 10)
            req.body.type = "admin";



            const user = await adminModel(req.body);
            await user.save();

            const token = jwt.sign({ _id: user._id }, process.env.SECRET)
            req.flash("success", "registration succesfull");
            res.redirect("/login");



        }
    } catch (error) {
        console.log(error)
        throw error
    }
}
exports.loginData = async (req, res) => {
    try {
        res.locals.message = req.flash();

        const { email, password } = req.body
        if (email) {

            const user = await adminModel.findOne({ email: req.body.email });
            if (user) {

                const match = await bcrypt.compare(password, user.password)

                if (match) {

                    const token = jwt.sign({ _id: user._id }, process.env.SECRET);
                    res.cookie("jwt",token,{
                        expires:new Date(Date.now()+50000000),
                        httpOnly:true
                    })

                    req.flash("success", "login successfully")

                    res.redirect("/dashboard")


                } else {

                    req.flash("error", "invalid login details");
                    res.redirect("/login");


                }

            } else {

                req.flash("error", "invalid login details");
                res.redirect("/login");


            }
        }


    } catch (error) {
        console.log(error)
        throw error
    }
}
// exports.add_Saloon_View = async (req, res) => {
//     try {
//         res.locals.message = req.flash();

//         res.render("add_saloon")

//     }
//     catch (error) {
//         console.log(error)
//         throw error
//     }
// }

// exports.login_Add_Saloon_View = async (req, res) => {
//     try {
//         res.locals.message = req.flash();

//         res.render("login_add_saloon")

//     }
//     catch (error) {
//         console.log(error)
//         throw error
//     }
// }
// exports.view_saloon = async (req, res) => {
//     try {
//         res.locals.message = req.flash();

//         res.render("login_add_saloon")

//     }
//     catch (error) {
//         console.log(error)
//         throw error
//     }
// }


// exports.add_Saloon = async (req,res) => {
//     try {
//         let {body, user, files, query } = req
//         res.locals.message=req.flash();
//         if (query.id) {
            
//             let _id = mongoose.Types.ObjectId(query.id);
//             const result = await saloon.findOne({ _id });
//             if (result) {
//                 let obj = {};
//                 let locations = {};
//                 const match = await bcrypt.compare(body.password, user.password)
//                 if(match)
//                 {

//                 if (body.storeName) { obj.storeName = body.storeName };
//                 if (body.Email) { obj.Email = body.Email };
//                 if (body.PhoneNumber) { obj.PhoneNumber = body.PhoneNumber };
//                 if (body.shopNumber) { locations.shopNumber = body.shopNumber };
//                 if (body.aria) { locations.aria = body.aria };
//                 if (body.pincode) { locations.pincode = body.pincode };
//                 if (body.city) { locations.city = body.city };
//                 if (body.state) { locations.state = body.state };
//                 if (body.fulladdress) { locations.fulladdress = body.fulladdress };
//                 if (body.description) { obj.description = body.description };
//                 if (body.userId) { obj.userId = body.userId };
//                 if (files) {
//                     img = []
//                     files.forEach(element => {
//                         img.push(element.filename)
//                     });
//                     obj.image = img
//                 }
//                 obj.location = locations;
//                 const result = await saloon.findByIdAndUpdate({ _id }, { $set: obj }, { new: true });
//                 if (result) {
//                     req.flash("success","Saloon-Store is  Update successfull !")
//                     res.redirect("/add_saloon_view")
//                     // return {
//                     //     statusCode: 200,
//                     //     status: true,
//                     //     message: "Saloon-Store is  Update successfull !",
//                     //     data: [result]
//                     // };
//                 };
//             }
//             else{
//                 req.flash("error","Saloon-Store is  Update successfull !")
//                 res.redirect("/add_saloon_view")
//                 // return {
//                 //     statusCode: 400,
//                 //     status: false,
//                 //     message: "Password Not Matched",
//                 //     data: []
//                 // };
//             }
//             } else {
//                 req.flash("error","Saloon-Store is Not Found !")
//                 res.redirect("/add_saloon_view")
//                 // return {
//                 //     statusCode: 400,
//                 //     status: false,
//                 //     message: "Saloon-Store is Not Found !",
//                 //     data: [result]
//                 // };
//             };
//         } else {
//             const { storeName, Email, PhoneNumber } = body;
//             body.userId = user._id;
//             if (storeName) {
//                 const result = await saloon.findOne({ storeName });
//                 if (result) {
//                     req.flash("error","storeName Already Exists")
//                     res.redirect("/add_saloon_view")

//                     // return {
//                     //     statusCode: 400,
//                     //     status: false,
//                     //     message: "storeName Already Exists",
//                     //     data: []
//                     // };
//                 };
//             };
//             if (Email) {
//                 const result = await saloon.findOne({ Email });
//                 if (result) {
//                     req.flash("error","Email Already Exists")
//                     res.redirect("/add_saloon_view")
//                     // return {
//                     //     statusCode: 400,
//                     //     status: false,
//                     //     message: "Email Already Exists",
//                     //     data: []
//                     // };
//                 };
//             };
//             if (PhoneNumber) {
//                 const result = await saloon.findOne({ PhoneNumber });
//                 if (result) {
//                     req.flash("error","PhoneNumber Already Exists")
//                     res.redirect("/add_saloon_view")
//                     // return {
//                     //     statusCode: 400,
//                     //     status: false,
//                     //     message: "PhoneNumber Already Exists",
//                     //     data: []
//                     // };
//                 };
//             };
//             if (files) {
//                 img = []
//                 files.forEach(element => {
//                     img.push(element.filename)
//                 });
//                 body.image = img
//             } else {
//                 body.image = ""
//             }
//             body.password = bcrypt.hashSync(body.password, 10);
//             let saloon_details = new saloon({
//                 storeName: body.storeName,
//                 Email: body.Email,
//                 PhoneNumber: body.PhoneNumber,
//                 password:body.password,
//                 location: {
//                     shopNumber: body.shopNumber,
//                     aria: body.aria,
//                     pincode: body.pincode,
//                     city: body.city,
//                     state: body.state,
//                     fulladdress: body.fulladdress

//                 },
//                 description: body.description,
//                 userId: body.userId,
//                 image: body.image,
//             });
//             const result = await saloon_details.save();
//             if (result) {
//                 req.flash("success","register-Saloon-Store Succesfuuly !")
//                 res.redirect("/add_saloon_view")
//                 //res.send("data add successfully")
//                 // return {
//                 //     statusCode: 200,
//                 //     status: true,
//                 //     message: "register-Saloon-Store Succesfuuly !",
//                 //     data: [result]
//                 // };
//             };
//         }
//     } catch (error) {
//         console.log(error);
//         throw error;
//     };
// }
