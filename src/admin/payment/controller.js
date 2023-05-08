const payment = require("../../api/payment/model");
const mongoose = require("mongoose");
const { getAllSaloonCity } = require("../../api/saloonstore/controller");
const moment = require("moment")
const saloon = require("../../api/saloonstore/model")


exports.ViewAllPayment = async (req, res) => {
    try {
        let serchobj = {}; //for user name
        let serchobj2 = {};// for payment search
        if (req.query.customername) {
            serchobj.name = { $regex: req.query.customername, $options: "i" };
        }
        if (req.query.paymentstatus) {
            serchobj2.payment = { $regex: req.query.paymentstatus, $options: "i" };
        } else {
            serchobj2.payment = "Payment successfull";
        }
        if (req.query.amount) {
            serchobj2["orderData.amount"] = { $gte: Number(req.query.amount) * 100 };
        }
        let condition = [];
        if (req.user.type == "admin") {
            condition.push({
                '$match': {
                    'userId': req.user._id
                }
            })
        }
        condition.push({
            '$lookup': {
                'from': 'orders',
                'localField': '_id',
                'foreignField': 'saloonId',
                'pipeline': [
                    {
                        '$project': {
                            'PaymentId': 1
                        }
                    }
                ],
                'as': 'order'
            }
        }, {
            '$unwind': {
                'path': '$order'
            }
        }, {
            '$replaceRoot': {
                'newRoot': '$order'
            }
        }, {
            '$lookup': {
                'from': 'payments',
                'localField': 'PaymentId',
                'foreignField': '_id',
                'pipeline': [
                    {
                        '$match': {
                            'payment': serchobj2.payment
                        }
                    }
                ],
                'as': 'payment'
            }
        }, {
            '$unwind': {
                'path': '$payment'
            }
        }, {
            '$replaceRoot': {
                'newRoot': '$payment'
            }
        })

        condition.push({
            "$match": serchobj2
        }, {
            '$lookup': {
                'from': 'users',
                'localField': 'userId',
                'foreignField': '_id',
                'pipeline': [
                    {
                        "$match": serchobj
                    }, {
                        '$project': {
                            'name': 1
                        }
                    }
                ],
                'as': 'user'
            }
        }, {
            '$unwind': {
                'path': '$user',
            }
        }, {
            '$sort': {
                'createdAt': 1
            }
        })

        const updateData = await saloon.aggregate(condition);

        updateData.forEach((item) => {
            let Date = moment(item.createdAt).format("DD-MMM-YYYY");
            let Time = moment(item.createdAt).format("hh:mm:ss");
            item.Date = Date
            item.Time = Time
        });


        res.render("payment/View-All-payment", { user: req.user, data: updateData, query: req.query });

    } catch (error) {
        console.log(error);
    };
};



exports.DeletePayment = async (req, res) => {
    try {



        // yaha payment return hota hai to
        //  uska order bhi cencal hogha paise 
        // user ke welloth me add hoghe yaa return hoghe 
        if (req.query.id != undefined && req.query.id != "") {
            const updateData = await payment.findByIdAndDelete({ _id: mongoose.Types.ObjectId(req.query.id) })
            if (updateData) {
                res.redirect("/view-all-payment");
            };
        } else {
            res.redirect("/");
        }
    } catch (error) {
        console.log(error);
    };
};


