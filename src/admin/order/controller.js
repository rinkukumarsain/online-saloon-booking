
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
            if (req.body.userId != undefined && req.body.userId != "") {
                req.query.userId = req.body.userId
            }
            res.render("order/index", { data: findOrder.data, query: req.query, user, city: FindAllcity.data })
        } else {
            req.flash("error", "no data found")
            res.render("order/index", { data: findOrder.data, query: req.query, user, city: FindAllcity.data })
        }
    } catch (error) {
        console.log(error);
    }
}
const { paymentsRefund } = require("../../api/payment/controller")
exports.orderCancel = async (req, res) => {
    try {
        if (req.query.id) {
            const _id = mongoose.Types.ObjectId(req.query.id);
            const findOrder = await order.findOne({ _id });
            if (findOrder) {
                const orderCencal = await order.findByIdAndUpdate({ _id }, { status: "cancel" }, { new: true })
                if (orderCencal) {
                    // user ke pise refund
                    // refund paise 
                    req.query._id = orderCencal.PaymentId
                    const paymentRefund = await paymentsRefund(req)
                    // refund paise successfull
                    if (paymentRefund) {
                        res.redirect("/get-All-order")
                    } else {
                        res.redirect("/")
                    }
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




exports.FindDateForAdminModule = async (req, res) => {
    try {
        const FindData = await order.aggregate([
            {
                '$match': {
                    '_id': mongoose.Types.ObjectId(req.query.id)
                }
            }, {
                '$project': {
                    'cartdata': 1
                }
            }, {
                '$unwind': {
                    'path': '$cartdata'
                }
            }, {
                '$lookup': {
                    'from': 'saloonservices',
                    'localField': 'cartdata.serviceId',
                    'foreignField': '_id',
                    'pipeline': [
                        {
                            '$project': {
                                '_id': 0,
                                'ServiceName': 1
                            }
                        }
                    ],
                    'as': 'service'
                }
            }, {
                '$unwind': {
                    'path': '$service'
                }
            },
        ])

        res.send(FindData)
    } catch (error) {
        console.log(error);
    }
}