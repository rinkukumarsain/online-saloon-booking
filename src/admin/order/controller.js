
const { getAllOrder } = require("./services")
const order = require("../../api/order/model")
const mongoose = require("mongoose")
const { getAllSaloonCity } = require("../../api/saloonstore/controller")


exports.getAllOrder = async (req, res) => {
    try {
        res.locals.message = req.flash();

        const user = req.user
        const findOrder = await getAllOrder(req)
        const FindAllcity = await getAllSaloonCity(req)
        if (findOrder.status == true && FindAllcity.status == true) {
            // console.log("datat", findOrder)
            res.render("order/index", { data: findOrder.data, user, city: FindAllcity.data })
        } else {
            // res.locals.message = req.flash();
            // res.render("users/login")
            console.log("no data found")
            req.flash("error", "no data found")
            res.redirect("/")
        }

    } catch (error) {
        console.log(error);
        throw error;
    }
}

exports.orderCancel = async (req, res) => {
    try {
        if (req.query.id) {
            const _id = mongoose.Types.ObjectId(req.query.id);
            const findOrder = await order.findOne({ _id });
            if (findOrder) {
                const orderCencal = await order.findByIdAndUpdate({ _id }, { status: "cancel" }, { new: true })
                if (orderCencal) {
                    res.redirect("/get-All-order")
                };
            } else {
                res.redirect("/get-All-order")
            }
        } else {
            res.redirect("/get-All-order")
        }
    } catch (error) {
        console.log(error);
    };
};


/*
exports.register = async (req, res) => {
    try {
        res.locals.message = req.flash();
        res.render("users/register");
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
        res.render("users/login");
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
                    console.log("user",user)
                    const accessToken = jwt.sign({ _id: user._id }, process.env.accessToken);
                    const refreshToken = jwt.sign({ _id: user._id }, process.env.refreshToken);

                    res.cookie("accessToken", accessToken, {
                        expires: new Date(Date.now() + 60000 * 60 * 3),//1 minit
                        httpOnly: true,
                        overwrite: true
                    }).cookie("refreshToken", refreshToken, {
                        expires: new Date(Date.now() + 60000 * 60 * 24),//10 minit
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
exports.forgetPassword = async (req, res) => {
    try {
        res.render("users/Forget-Password", { user: req.user })
    } catch (error) {
        console.log(error);
        throw error;
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
        throw error;
    };
};

exports.usersProfile = async (req, res) => {
    try {
        res.locals.message = req.flash();
        const user = req.user;
        console.log("user", user)
        console.log("------------------>")
        res.render("users/usersProfile", { user });
    } catch (error) {
        console.log(error);
        throw error;
    };
};
exports.add_profile_data = async (req, res) => {
    try {console.log("sdaa")
        res.locals.message = req.flash();
        const user = req.user;
        const id=req.query.id;
        let obj={};
        console.log("body",req.body)
        console.log("user",user)
        let imagepath=user.image.split("/");
        console.log("imagepath",imagepath)
        
        if(req.body.name){obj.name=req.body.name}
        if(req.body.phone){obj.phone=req.body.phone}
        if(req.body.description){obj.description=req.body.description}
        //console.log()
        if(req.file){
            if (user.image) {
                try{
                fs.unlinkSync(`${path.join(__dirname, `/../../../public/uploads/${imagepath[4]}`)}`)
                 }catch(error)
                {
                   console.log(error) 
                } }
            obj.image = `http://159.89.164.11:7070/uploads/${req.file.filename}`
        }
        console.log("obj",obj)
        const updatedata=await userModel.findByIdAndUpdate(id,obj,{new:true});
         console.log("updatedat",updatedata)
         req.flash("success","profile updated successfully")
          
        res.redirect("/")
        // console.log("user", user)
        //res.render("users/usersProfile", { user });
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
        throw error;
    }
}
*/