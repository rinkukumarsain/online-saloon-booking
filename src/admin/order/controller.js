
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
            // console.log("req.query", req.query)
            res.render("order/index", { data: findOrder.data, query: req.query, user, city: FindAllcity.data })
        } else {
            // res.locals.message = req.flash();
            // res.render("users/login")
            console.log("no data found")
            req.flash("error", "no data found")
            res.redirect("/")
        }
    } catch (error) {
        console.log(error);
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




exports.FindDateForAdminModule = async (req, res) => {
    try {
        console.log("req.jhgd", req.query, req.query.id, Number(req.query.id))
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
        console.log(FindData)
        // FindData.cartdata.forEach(element => {
        //     console.log("req.jhgd", element)

        // });
        res.send(FindData)
    } catch (error) {
        console.log(error);
    }
}