const users = require("../user/model");
const servish = require("../saloonService/model");
const { default: mongoose } = require("mongoose");
const coupon = require("../coupon/model");
const order = require("../order/model");
const userModel = require("../user/model");
const cart = require("../cart/model");
const payment = require("../payment/model");
const transaction = require("../refer And ponts/modelTra");

exports.Checkout = async ({ user, query }) => {
    try {
        let condition = [];
        condition.push({
            '$match': {
                '_id': user._id
            }
        });
        condition.push({
            '$lookup': {
                from: "carts",
                localField: "_id",
                foreignField: "userId",
                pipeline: [
                    {
                        $match: {
                            userId: user._id,
                            saloonId: mongoose.Types.ObjectId(query.saloonId)
                        },
                    },
                ],
                as: "cartData",
            }
        });
        condition.push({
            '$unwind': {
                'path': '$cartData'
            }
        });

        if (query.addressId != undefined && query.addressId != "") {
            condition.push({
                '$project': {
                    'name': 1,
                    'phone': 1,
                    'email': 1,
                    'cartId': '$cartData._id',
                    'saloonId': '$cartData.saloonId',
                    'cartdata': '$cartData.cartdata',
                    'totalamount': '$cartData.totalamount',
                    'addressId': mongoose.Types.ObjectId(query.addressId)
                }
            });
        } else {
            condition.push({
                '$project': {
                    'name': 1,
                    'phone': 1,
                    'email': 1,
                    'cartId': '$cartData._id',
                    'saloonId': '$cartData.saloonId',
                    'cartdata': '$cartData.cartdata',
                    'totalamount': '$cartData.totalamount',
                }
            });
        };
        condition.push({
            '$lookup': {
                'from': 'saloons',
                'localField': 'saloonId',
                'foreignField': '_id',
                'as': 'saloon'
            }
        });
        if (query.addressId != undefined && query.addressId != "") {
            condition.push({
                '$lookup': {
                    'from': 'useraddresses',
                    'localField': 'addressId',
                    'foreignField': '_id',
                    'as': 'Address'
                }
            }, {
                '$unwind': {
                    'path': '$Address'
                }
            });
        };

        condition.push({
            '$lookup': {
                'from': 'schedules',
                'localField': '_id',
                'foreignField': 'userId',
                'let': {
                    'cartId': '$cartId'
                },
                'pipeline': [
                    {
                        '$match': {
                            '$expr': {
                                '$eq': [
                                    '$cartId', '$$cartId'
                                ]
                            }
                        }
                    }
                ],
                'as': 'schedule'
            }
        });
        condition.push({
            '$unwind': {
                'path': '$saloon'
            }
        });
        condition.push({
            '$unwind': {
                'path': '$schedule'
            }
        });

        if (query.couponId != undefined && query.couponId != "") {

            const findCoupon = await coupon.findOne({ _id: mongoose.Types.ObjectId(query.couponId) });
            if (findCoupon) {
                const findOrder = await order.find({ userId: user._id, couponId: mongoose.Types.ObjectId(query.couponId) });
                console.log("user",user._id)
                console.log(findOrder.length,"findOrder", "limit", findCoupon.Limit)
                if (findOrder.length > findCoupon.Limit) {
                    return {
                        statusCode: 400,
                        status: false,
                        message: "you are use this coupon over limit  !",
                        data: []
                    };
                };
                condition.push({
                    '$lookup': {
                        'from': 'coupons',
                        'pipeline': [
                            {
                                '$match': {
                                    '_id': findCoupon._id
                                }
                            }, {
                                '$project': {
                                    'Discount': 1,
                                    'Amount': 1,
                                    'Limit': 1
                                }
                            }
                        ],
                        'as': 'coupon'
                    }
                }, {
                    '$unwind': {
                        'path': '$coupon'
                    }
                });
                condition.push({
                    '$project': {
                        _id: 0,
                        name: 1,
                        phone: 1,
                        email: 1,
                        Time: "$schedule.timeslot",
                        Date: "$schedule.date",
                        cartdata: 1,
                        userAddress: "$Address.location",
                        storedetail: {
                            storeName: "$saloon.storeName",
                            location: "$saloon.location",
                            PhoneNumber: "$saloon.PhoneNumber",
                            Email: "$saloon.Email",
                        },
                        totalamount: 1,
                        Discount: {
                            $cond: [
                                { $gte: ["$totalamount", '$coupon.Amount'] },
                                "$coupon.Discount",
                                0,
                            ],
                        },
                        finalTotalAmount: {
                            $cond: [
                                { $gte: ["$totalamount", '$coupon.Amount'] },
                                {
                                    $subtract: [
                                        "$totalamount",
                                        "$coupon.Discount",
                                    ],
                                },
                                0,
                            ],
                        },
                    }
                });
            } else {
                return {
                    statusCode: 400,
                    status: true,
                    message: "please Enter valid coupon code  !",
                    data: []
                };
            };
        } else {


            condition.push({
                '$project': {
                    '_id': 0,
                    'name': 1,
                    'phone': 1,
                    'email': 1,
                    'totalamount': 1,
                    'cartId': 1,
                    'Time': '$schedule.timeslot',
                    'Date': '$schedule.date',
                    'cartdata': 1,
                    'userAddress': '$Address.location',
                    'storedetail': {
                        '_id': '$saloon._id',
                        'storeName': '$saloon.storeName',
                        'location': '$saloon.location',
                        'PhoneNumber': '$saloon.PhoneNumber',
                        'Email': '$saloon.Email'
                    }
                }
            });
        };

        const findData = await users.aggregate(condition);

        if (findData.length > 0) {
            const { cartdata, ...Checkout } = findData[0];
            const cartitem = findData[0].cartdata;
            let cart = [];
            for (const item of cartitem) {
                let userServish = {};
                const findservish = await servish.findOne({ _id: item.serviceId });
                userServish.ServiceName = findservish.ServiceName;
                userServish.ServicePrice = findservish.ServicePrice;
                userServish.quantity = item.quantity;
                userServish.Amount = item.Amount;
                cart.push(userServish);
            };
            Checkout.cart = cart;

            /* if (query.balance != undefined && query.balance != "") {
                 Checkout.user = user
                 const data = await this.applyBalance(Checkout)
                 data.user = ""
                 if (data.statusCode == 200 && data.status == true) {
                     return {
                         statusCode: 200,
                         status: true,
                         message: "Checkout  Succesfuuly ! 1",
                         data: data.data
                     };
                 }
             }*/
            return {
                statusCode: 200,
                status: true,
                message: "Checkout  Succesfuuly !",
                data: [Checkout]
            };
        } else {
            return {
                statusCode: 400,
                status: false,
                message: "data not Found !",
                data: []

            };
        }
    } catch (error) {
        console.log(error);
    };
};


/*
exports.applyBalance = async (data) => {
    try {
        //2000 ch balance 
        //3000 ka saman totalamount
        // gs
        if (data.user.userWallet.balance > 0) {

            if (data.user.userWallet.balance >= data.totalamount) {
                3000 == 3000 - 2000
                // Amount = data.user.userWallet.balance - data.totalamount
                const Data = await userModel.findByIdAndUpdate({ _id: data.user._id }, { $inc: { "userWallet.useBalance": +data.totalamount, "userWallet.balance": -data.totalamount } }, { new: true });
                data.totalamount = 0
            } else if (data.user.userWallet.balance < data.totalamount) {
                a = 3002 - 2000
                let amount = data.totalamount - data.user.userWallet.balance
                const Data = await userModel.findByIdAndUpdate({ _id: data.user._id }, { $inc: { "userWallet.useBalance": +data.user.userWallet.balance, "userWallet.balance": -data.user.userWallet.balance } }, { new: true });
                data.totalamount = amount
            };

            return data;
        } else {
            return {
                statusCode: 400,
                status: false,
                message: "your balace is Zero !",
                data: []
            };
        };
    } catch (erore) {
        console.log(erore);
    };
};*/

const { walletTransaction } = require("../refer And ponts/controller");
exports.applyBalance = async (req, res) => {
    try {
        const findcart = await cart.findOne({ _id: req.query.cartId }, { totalamount: 1, disCount: 1, pay: 1 });
        if (findcart.pay > 0) {
            return {
                statusCode: 200,
                status: true,
                message: "Allready apply  !",
                data: [findcart]
            };
        };

        const { user } = req
        if (user.userWallet.balance > 0) {
            let Data;
            if (user.userWallet.balance >= findcart.totalamount) {
                Amount = user.userWallet.balance - findcart.totalamount;

                Data = await userModel.findByIdAndUpdate({ _id: user._id }, { $inc: { "userWallet.useBalance": +findcart.totalamount, "userWallet.balance": -findcart.totalamount } }, { new: true });
                findcart.totalamount = 0;
                findcart._doc.disCount = findcart.totalamount;
            } else if (user.userWallet.balance < findcart.totalamount) {
                let amount = findcart.totalamount - user.userWallet.balance;

                Data = await userModel.findByIdAndUpdate({ _id: user._id }, { $inc: { "userWallet.useBalance": +user.userWallet.balance, "userWallet.balance": -user.userWallet.balance } }, { new: true });
                findcart.totalamount = amount;
                findcart._doc.disCount = user.userWallet.balance;
            };

            if (Data) {
                const updateCart = await cart.findByIdAndUpdate({ _id: findcart._id }, { pay: findcart.totalamount, disCount: findcart._doc.disCount }, { new: true })
                // tragaction save 
                let body = {};
                body.userId = user._id;
                body.moneyType = "balance";
                body.status = "pending";
                body.amount = updateCart.disCount;
                body.type = "debit";
                req.body = body;
                const saveTragaction = await walletTransaction(req);
                let obj = {};
                obj._id = updateCart._id;
                obj.totalamount = updateCart.totalamount;
                obj.disCount = updateCart.disCount;
                obj.pay = updateCart.pay;
                return {
                    statusCode: 200,
                    status: true,
                    message: "apply balance Succesfuuly !",
                    data: [obj]
                };
            };
        } else {
            return {
                statusCode: 400,
                status: false,
                message: "your balance is Zero !",
                data: []
            };
        };
    } catch (erore) {
        console.log(erore);
    };
};