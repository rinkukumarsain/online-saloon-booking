const service = require("../saloonService/model");
const mongoose = require("mongoose");
const cart = require("./model");
const saloon = require("../saloonstore/model");

exports.cartRegistration = async ({ body, user, query }) => {
    try {
        let obj = {};
        let arr = [];
        let totalamount = [];
        const findData = await cart.findOne({ userId: user._id });
        if (!findData) {
            obj.userId = user._id;
            if (body.saloonId) {
                let _id = mongoose.Types.ObjectId(body.saloonId);
                const findSaloon = await saloon.findOne({ _id });
                if (findSaloon) {
                    obj.saloonId = body.saloonId;
                } else {
                    return {
                        statusCode: 400,
                        status: false,
                        message: "Enter Valid saloon Id !",
                        data: []
                    };
                };
            };
            if (body.cartData != undefined) {
                if (body.cartData.length > 0) {
                    for await (const item of body.cartData) {
                        let cartdata = {};
                        let _id = item.serviceId;
                        const finddata = await service.findOne({ _id: item.serviceId });
                        if (finddata != null) {
                            cartdata.serviceId = finddata._id;
                            cartdata.quantity = item.quantity;
                            cartdata.Amount = item.quantity * finddata.ServicePrice;
                            cartdata.timePeriod_in_minits = finddata.timePeriod_in_minits;
                            arr.push(cartdata);
                            totalamount.push(cartdata.Amount);
                        }
                    };
                    obj.cartdata = arr;
                };
            }
            const sum = totalamount.reduce(add, 0);
            function add(accumulator, a) {
                return accumulator + a;
            };
            obj.totalamount = sum;

            let cart_detail = new cart(obj);
            const result = await cart_detail.save();
            if (result) {
                return {
                    statusCode: 200,
                    status: true,
                    message: "User-Cart-register- Succesfuuly !",
                    data: [result]
                };
            };
        } else {
            if (findData.cartdata.length == 0) {
                obj.userId = user._id;
                if (body.saloonId) {
                    let _id = mongoose.Types.ObjectId(body.saloonId);
                    const findSaloon = await saloon.findOne({ _id });
                    if (findSaloon) {
                        obj.saloonId = body.saloonId;
                    } else {
                        return {
                            statusCode: 400,
                            status: false,
                            message: "Enter Valid saloon Id !",
                            data: []
                        };
                    };
                };
                if (body.cartData != undefined) {
                    if (body.cartData.length > 0) {
                        for await (const item of body.cartData) {
                            let cartdata = {};
                            let _id = item.serviceId;
                            const finddata = await service.findOne({ _id: item.serviceId });
                            if (finddata != null) {
                                cartdata.serviceId = finddata._id;
                                cartdata.quantity = item.quantity;
                                cartdata.Amount = item.quantity * finddata.ServicePrice;
                                cartdata.timePeriod_in_minits = finddata.timePeriod_in_minits;
                                arr.push(cartdata);
                                totalamount.push(cartdata.Amount);
                            };
                        }
                        obj.cartdata = arr;
                    }
                }
                const sum = totalamount.reduce(add, 0);
                function add(accumulator, a) {
                    return accumulator + a;
                }
                obj.totalamount = sum;
                const result = await cart.findByIdAndUpdate({ _id: findData._id }, { $set: obj }, { new: true });
                if (result) {
                    return {
                        statusCode: 200,
                        status: true,
                        message: "Cart-Is-Allready-Register-service-added !",
                        data: [result]
                    };
                };
            } else {
                return {
                    statusCode: 400,
                    status: false,
                    message: "Cart-Is-Allready-Register !",
                    data: [findData]
                };
            };
        };
    } catch (error) {
        console.log(error);
        throw error;
    };
};


exports.removeServishFromCart = async ({ body, user, query }) => {
    try {
        if (query.id) {
            const _id = mongoose.Types.ObjectId(query.id);
            const findData = await cart.findOne({ _id });
            let cartdata = [];
            let Amount = [];
            let obj = {};
            if (findData) {
                if (query.serviceId) {
                    if (findData.cartdata.length > 0) {
                        let i = 1;
                        for (const item of findData.cartdata) {
                            if (item.serviceId.toString() == query.serviceId && i === 1) {
                                i++;
                            } else {
                                cartdata.push(item);
                                Amount.push(Number(item.Amount));
                            };
                        };
                        const serviceId = mongoose.Types.ObjectId(query.serviceId);
                        obj.cartdata = cartdata;
                        if (Amount.length > 0) {
                            const sum = Amount.reduce(add, 0);
                            function add(accumulator, a) {
                                return accumulator + a;
                            };
                            obj.totalamount = sum;
                        } else { obj.totalamount = 0 }
                        const result = await cart.findByIdAndUpdate({ _id }, { $set: obj }, { new: true });
                        if (result) {
                            return {
                                statusCode: 200,
                                status: true,
                                message: "Remove-Servish-From-User-Cart- Succesfuuly !",
                                data: [result]
                            };
                        };

                    } else {
                        return {
                            statusCode: 200,
                            status: true,
                            message: "Cart Is already Empty !",
                            data: []
                        };
                    };
                } else {
                    return {
                        statusCode: 400,
                        status: false,
                        message: "Please-Enter-Valid-sarvice -Id !",
                        data: []
                    };
                };
            } else {
                return {
                    statusCode: 200,
                    status: true,
                    message: "Please-Enter-Valid-Cart-Id !",
                    data: []
                };
            };
        } else {
            return {
                statusCode: 400,
                status: false,
                message: "please-Enter-Valid-Cart-Id !",
                data: []
            };
        };
    } catch (error) {
        console.log(error);
        throw error;
    };
};

exports.getcart = async ({ user }) => {

    const findData = await cart.aggregate([
        {
            '$match': {
                'userId': user._id
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
                'as': 'result'
            }
        }, {
            '$unwind': {
                'path': '$result'
            }
        }, {
            '$project': {
                'totalamount': 1,
                'cartdata': {
                    'quantity': '$cartdata.quantity',
                    'Amount': '$cartdata.Amount',
                    'ServiceName': '$result.ServiceName',
                    'ServicePrice': '$result.ServicePrice',
                    'timePeriod_in_minits': '$result.timePeriod_in_minits',
                    'serviceProvider': '$result.serviceProvider',
                    'image': '$result.image',
                    'description': '$result.description'
                }
            }
        }
    ]);
    if (findData) {
        return {
            statusCode: 200,
            status: true,
            message: "your cart is hare !",
            data: [findData]
        };
    } else {
        return {
            statusCode: 400,
            status: false,
            message: "NO Cart !",
            data: []
        };
    };
};





exports.addcart = async ({ body, user, query }) => {
    try {
        let serviceArr = [];
        let findService;
        if (query.serviceId) {
            let _id = mongoose.Types.ObjectId(query.serviceId);
            findService = await service.findOne({ _id });
            if (!findService) {
                return {
                    statusCode: 400,
                    status: false,
                    message: "service is  not Found please Enter valide servish Id !",
                    data: []
                };
            };
        };

        const FindCart = await cart.findOne({ userId: user._id });
        if (FindCart) {
            if (FindCart.cartdata.length > 0) {
                for (const item of FindCart.cartdata) {
                    let serviceId = item.serviceId.toString()
                    serviceArr.push(item)
                };
            };
            serviceArr.push({
                serviceId: findService._id,
                Amount: findService.ServicePrice,
                quantity: 1,
                timePeriod_in_minits: findService.timePeriod_in_minits,
            });
            let totalamount = [];
            serviceArr.forEach(element => {
                totalamount.push(Number(element.Amount))
            });
            let sum = totalamount.reduce(function (x, y) {
                return x + y;
            }, 0);

            const result = await cart.findByIdAndUpdate({ _id: FindCart._id }, { $set: { cartdata: serviceArr, totalamount: sum } }, { new: true });
            if (result) {
                return {
                    statusCode: 200,
                    status: true,
                    message: "service added in cart Succesfuuly !",
                    data: [result]
                };
            };
        } else {
            return {
                statusCode: 400,
                status: false,
                message: "cart not Found register karwao !",
                data: [FindCart]
            };
        };
    } catch (error) {
        console.log(error);
        throw error;
    };
};
