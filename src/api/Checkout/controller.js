const users = require("../user/model");
const servish = require("../saloonService/model");

exports.Checkout = async ({ user }) => {
    try {
        let condition = [
            {
                '$match': {
                    '_id': user._id
                }
            }, {
                '$lookup': {
                    'from': 'carts',
                    'localField': '_id',
                    'foreignField': 'userId',
                    'as': 'cartData'
                }
            }, {
                '$unwind': {
                    'path': '$cartData'
                }
            }, {
                '$project': {
                    'name': 1,
                    'phone': 1,
                    'email': 1,
                    'saloonId': '$cartData.saloonId',
                    'cartdata': '$cartData.cartdata',
                    'totalamount': '$cartData.totalamount',
                    'addressId': '$cartData.addressId'
                }
            }, {
                '$lookup': {
                    'from': 'saloons',
                    'localField': 'saloonId',
                    'foreignField': '_id',
                    'as': 'saloon'
                }
            }, {
                '$lookup': {
                    'from': 'useraddresses',
                    'localField': 'addressId',
                    'foreignField': '_id',
                    'as': 'Address'
                }
            }, {
                '$lookup': {
                    'from': 'schedules',
                    'localField': '_id',
                    'foreignField': 'userId',
                    'as': 'schedule'
                }
            }, {
                '$unwind': {
                    'path': '$saloon'
                }
            }, {
                '$unwind': {
                    'path': '$Address'
                }
            }, {
                '$unwind': {
                    'path': '$schedule'
                }
            }, {
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
            }
        ];

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