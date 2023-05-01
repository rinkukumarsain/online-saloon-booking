const payment = require("../../api/payment/model");
const mongoose = require("mongoose");
const { getAllSaloonCity } = require("../../api/saloonstore/controller");
const moment = require("moment")


exports.ViewAllPayment = async (req, res) => {
    try {

        let serchobj = {};
        let serchobj2 = {};
        let searchobj = {};
        if (req.query.customername) {
            searchobj.customername = req.query.customername;
            serchobj.name = { $regex: req.query.customername, $options: "i" };
        }
        if (req.query.paymentstatus) {
            searchobj.paymentstatus = req.query.paymentstatus;
            serchobj2.payment = { $regex: req.query.paymentstatus, $options: "i" };
        }
        if (req.query.amount) {
            searchobj.Amount = req.query.amount;
            serchobj2["orderData.amount"] = { $gte: +req.query.amount };
        }
        const updateData = await payment.aggregate([
            { "$match": serchobj2 }, {
                '$lookup': {
                    'from': 'users',
                    'localField': 'userId',
                    'foreignField': '_id',
                    'pipeline': [
                        { "$match": serchobj }, {
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
                    'preserveNullAndEmptyArrays': true
                }
            },
            // {
            //     '$match': {
            //         'orderId': {
            //             '$exists': true
            //         }
            //     }
            // }
        ]);

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
        // 
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


