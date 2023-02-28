const users = require("../user/model");
const servish = require("../saloonService/model");
const { default: mongoose } = require("mongoose");

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
                'from': 'carts',
                'localField': '_id',
                'foreignField': 'userId',
                'as': 'cartData'
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
        },
            {
                '$unwind': {
                    'path': '$schedule'
                }
            },
            {
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

        // ];

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
        throw error;
    };
};