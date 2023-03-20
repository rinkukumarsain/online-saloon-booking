
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

exports.AdminOrderApprove = async (req, res) => {
    try {
        if (req.query.id) {
            const _id = mongoose.Types.ObjectId(req.query.id);
            const findOrder = await order.findOne({ _id });
            if (findOrder) {
                const orderCencal = await order.findByIdAndUpdate({ _id }, { status: "succes" }, { new: true })
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