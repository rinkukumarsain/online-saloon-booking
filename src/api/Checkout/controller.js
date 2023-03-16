const users = require("../user/model");
const servish = require("../saloonService/model");
const { default: mongoose } = require("mongoose");
const coupon = require("../coupon/model")

exports.Checkout = async ({ user, query }) => {
    try {
        let condition = [];
        // let condition = [
        condition.push({
            '$match': {
                '_id': user._id
            }
        })
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
        })
        condition.push({
            '$unwind': {
                'path': '$cartData'
            }
        })
        // condition.push({
        //     '$project': {
        //         'name': 1,
        //         'phone': 1,
        //         'email': 1,
        //         'saloonId': '$cartData.saloonId',
        //         'cartdata': '$cartData.cartdata',
        //         'totalamount': '$cartData.totalamount',
        //         // 'addressId': '$cartData.addressId'
        //     }
        // })
        if (query.Home != undefined && query.Home != "") {
            condition.push({
                '$project': {
                    'name': 1,
                    'phone': 1,
                    'email': 1,
                    'saloonId': '$cartData.saloonId',
                    'cartdata': '$cartData.cartdata',
                    'totalamount': '$cartData.totalamount',
                    'addressId': mongoose.Types.ObjectId(query.Home)
                }
            })
        } else {
            condition.push({
                '$project': {
                    'name': 1,
                    'phone': 1,
                    'email': 1,
                    'saloonId': '$cartData.saloonId',
                    'cartdata': '$cartData.cartdata',
                    'totalamount': '$cartData.totalamount',
                    // 'addressId': '$cartData.addressId'
                }
            })
        }
        condition.push({
            '$lookup': {
                'from': 'saloons',
                'localField': 'saloonId',
                'foreignField': '_id',
                'as': 'saloon'
            }
        })
        if (query.Home != undefined && query.Home != "") {
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
            })
        }

        condition.push({
            '$lookup': {
                'from': 'schedules',
                'localField': '_id',
                'foreignField': 'userId',
                'as': 'schedule'
            }
        })
        condition.push({
            '$unwind': {
                'path': '$saloon'
            }
        })
        condition.push({
            '$unwind': {
                'path': '$schedule'
            }
        })
        let o;
        if (query.couponId != undefined && query.couponId != "") {
            
            const findCoupon = await coupon.findOne({ _id: mongoose.Types.ObjectId(query.couponId) })
            if (findCoupon) {
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
                })
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
                        finalTotalAmount: {
                            $cond: [
                                { $gte: ["$totalamount", 2000] },
                                {
                                    $subtract: [
                                        "$totalamount",
                                        "$coupon.Discount",
                                    ],
                                },
                                "amount limit lt 2000",
                            ],
                        },
                    }
                })
            } else {
                return {
                    statusCode: 400,
                    status: true,
                    message: "please Enter valid coupon code  !",
                    data: []
                };
            }
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
            })
        }

        // ];

        const findData = await users.aggregate(condition);
        if (findData.length > 0) {
            // if (query.couponId != undefined && query.couponId != "") {
            /* const findCoupon = await coupon.findOne({ _id: mongoose.Types.ObjectId(query.couponId) })
             if (findCoupon) {

                 console.log("findCoupon--->", 1, findCoupon)
             } else {
                 return {
                     statusCode: 400,
                     status: false,
                     message: "please enter valide coupon code Succesfuuly !",
                     data: [Checkout]
                 };
             }*/
            // } else {
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
            // console.log("Checkout", Checkout)

            return {
                statusCode: 200,
                status: true,
                message: "Checkout  Succesfuuly !",
                data: [condition]
            };
            // }
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