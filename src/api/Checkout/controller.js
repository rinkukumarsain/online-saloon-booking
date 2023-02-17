const saloonservice = require("../saloonService/model")
const mongoose = require("mongoose");
const cart = require("../cart/model")
const userAddress = require("./model")
const users = require("../user/model")

exports.Checkout = async ({ user }) => {

    // console.log("Checkout", user)
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
    ]

    const findcha = await users.aggregate(condition)
    if (findcha) {
        console.log("findcha", findcha[0].cartdata)

        return {
            statusCode: 200,
            status: true,
            message: "Checkout !",
            data: findcha
        };
    }
}