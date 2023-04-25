const users = require("../user/model");
const servish = require("../saloonService/model");
const { default: mongoose } = require("mongoose");
const coupon = require("../coupon/model")
const order = require("../order/model")
const userModel = require("../user/model")

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
                    'Time': '$schedule.timeslot',
                    'Date': '$schedule.date',
                    'cartdata': 1,
                    'userAddress': '$Address.location',
                    'storedetail': {
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


            if (query.balance != undefined && query.balance != "") {
                // console.log("findData", 111)
                // let obj = {}
                // obj.userId = user._id
                // obj.query = query
                // obj.Data = findData
                Checkout.user = user
                const dd = await this.applyBalance(Checkout)
            }
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

exports.applyBalance = async (data) => {
    //cart ka balece 150 $$
    console.log("Checkout amount", 1, data.totalamount);
    // console.log("userWallet.balance", 22, data.user.userWallet.balance)
    // const data = await userModel.findByIdAndUpdate({ _id: user._id })
    // ufh

    if (data.user.userWallet.balance > 0) {
        console.log("userWallet.balance", 2, data.user.userWallet.balance)
        j

        if (data.user.userWallet.balance > data.totalamount) {
            // user balec me se --- kar do + 
            const data = await userModel.findByIdAndUpdate({ _id: data.user._id }, { $inc: { "userWallet.useBalance": +item.totalamount }, debitAmount }, { new: true })
            console.log("data", 1, data)
            data.totalamount = 0
        } else if (data.user.userWallet.balance <= data.totalamount) {
            data.totalamount = data.totalamount - data.user.userWallet.balance
            const data = await userModel.findByIdAndUpdate({ _id: data.user._id }, { $inc: { "userWallet.useBalance": +item.totalamount } }, { new: true })
            console.log("data", 2, data)
        }

    } else {
        return {
            statusCode: 400,
            status: false,
            message: "your balace is Zero !",
            data: []
        };
    }
    // for (const item of data) {


    // }
}