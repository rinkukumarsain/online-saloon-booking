const service = require("../saloonService/model");
const mongoose = require("mongoose");
const cart = require("./model");
const saloon = require("../saloonstore/model");
const package = require("../../admin/servicePackage/model");

exports.removeserviceFromCart = async ({ body, user, query }) => {
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
    };
};

exports.getcart = async ({ user, query }) => {
    try {
        let arr = [];
        let condition = [];
        if (query.saloonId != undefined && query.saloonId != "") {
            condition.push({
                '$match': {
                    '$and': [
                        {
                            'userId': user._id
                        },
                        {
                            'saloonId': mongoose.Types.ObjectId(query.saloonId)
                        }
                    ]
                }
            })
        } else {
            condition.push({
                '$match': {
                    '$and': [
                        {
                            'userId': user._id
                        },
                    ]
                }
            })
        }

        condition.push({
            '$unwind': {
                'path': '$cartdata',
                'preserveNullAndEmptyArrays': true
            }
        }, {
            '$lookup': {
                'from': 'saloonservices',
                'localField': 'cartdata.serviceId',
                'foreignField': '_id',
                'as': 'cartdata'
            }
        }, {
            '$unwind': {
                'path': '$cartdata',
                'preserveNullAndEmptyArrays': true
            }
        }, {
            '$group': {
                '_id': '$_id',
                'Service': {
                    '$push': {
                        '_id': '$cartdata._id',
                        'ServiceName': '$cartdata.ServiceName',
                        'ServicePrice': '$cartdata.ServicePrice',
                        'timePeriod_in_minits': '$cartdata.timePeriod_in_minits',
                        'image': '$cartdata.image',
                        'description': '$cartdata.ServiceName'
                    }
                },
                'Package': {
                    '$first': '$Package'
                },
                'saloon': {
                    '$first': '$saloonId'
                }
            }
        }, {
            '$lookup': {
                'from': 'saloons',
                'localField': 'saloon',
                'foreignField': '_id',
                'as': 'saloon'
            }
        })
        // countOfPackage=0
        // if (countOfPackage > 0) {
        condition.push({
            '$unwind': {
                'path': '$Package',
                'preserveNullAndEmptyArrays': true

            }
        }, {
            '$lookup': {
                'from': 'packages',
                'localField': 'Package',
                'foreignField': '_id',
                'as': 'Package'
            }
        }, {
            '$unwind': {
                'path': '$Package',
                'preserveNullAndEmptyArrays': true
            }
        }, {
            '$group': {
                '_id': '$_id',
                'Service': {
                    '$first': '$Service'
                },
                'Package': {
                    '$push': {
                        '_id': '$Package._id',
                        'PackageName': '$Package.PackageName',
                        'Amount': '$Package.Amount',
                        'finalPrice': '$Package.finalPrice',
                        'gender': '$Package.gender'
                    }
                },
                'saloon': {
                    '$first': '$saloon'
                }
            }
        })
        // } else {
        //     condition.push({
        //         '$project': {
        //             'Package': 0
        //         }
        //     })
        // }
        const findData = await cart.aggregate(condition)

        if (findData) {
            return {
                statusCode: 200,
                status: true,
                message: "your cart is here !",
                data: findData
            };
        } else {
            return {
                statusCode: 400,
                status: false,
                message: "NO Cart !",
                data: []
            };
        };
    } catch (error) {
        console.log(error)
    };
};

exports.addcart = async ({ user, query }) => {
    try {
        let obj = {};
        let serviceArr = [];
        let findService;
        let newCart;
        let i;
        const findData = await cart.find({ userId: user._id });
        if (findData.length == 0) {
            //cart create 
            obj.userId = user._id;
            if (query.saloonId) {
                let _id = mongoose.Types.ObjectId(query.saloonId);
                const findSaloon = await saloon.findOne({ _id });
                if (findSaloon) {
                    obj.saloonId = query.saloonId;
                } else {
                    return {
                        statusCode: 400,
                        status: false,
                        message: "Enter Valid saloon Id !",
                        data: []
                    };
                };
            };
            let cart_detail = new cart(obj);
            const result = await cart_detail.save();
            if (result) {
                console.log("User-Cart-register- Succesfuuly !", 1)
            };
        } else if (findData.length > 0) {
            const findccc = await cart.findOne({ userId: user._id, saloonId: mongoose.Types.ObjectId(query.saloonId) })
            i = 1
            if (!findccc) {
                for await (const element of findData) {
                    if (query.saloonId != element.saloonId.toString() && i === 1) {
                        obj.userId = user._id;
                        obj.saloonId = query.saloonId;
                        let cart_detail = new cart(obj);
                        newCart = await cart_detail.save();
                        i++
                    }
                }
            }
        }
        console.log("User-Cart-register- Succesfuuly !", 2)


        if (query.serviceId) {
            let _id = mongoose.Types.ObjectId(query.serviceId);
            console.log("_id_id_id_id", _id)
            if (newCart) {
                findService = await service.findOne({ _id, saloonStore: newCart.saloonId });
                if (!findService) {
                    return {
                        statusCode: 400,
                        status: false,
                        message: "service is  not Found this Saloon store  !",
                        data: []
                    };
                } const FindCart = await cart.findOne({ userId: user._id, saloonId: mongoose.Types.ObjectId(query.saloonId) });
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
                }
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
                        message: "service added in new new cart Succesfuuly ! ",
                        data: [result]
                    };
                };

            } else {
                const findService = await service.findOne({ _id, saloonStore: mongoose.Types.ObjectId(query.saloonId) });
                if (!findService) {
                    return {
                        statusCode: 200,
                        status: true,
                        message: "not found servce in your selected store !",
                        data: []
                    };
                }

                const FindCart = await cart.findOne({ userId: user._id, saloonId: mongoose.Types.ObjectId(query.saloonId) });
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
                }
            }
        };

        // if (query.packageId) {
        //     let _id = mongoose.Types.ObjectId(query.packageId);
        //     if (newCart) {
        //         findPackage = await package.findOne({ _id, saloonStore: newCart.saloonId });
        //         if (!findPackage) {
        //             return {
        //                 statusCode: 400,
        //                 status: false,
        //                 message: "package is  not Found this Saloon store  !",
        //                 data: []
        //             };
        //         };
        //         const FindCart = await cart.findOne({ userId: user._id, saloonId: mongoose.Types.ObjectId(query.saloonId) });

        //         const result = await cart.findByIdAndUpdate({ _id: FindCart._id }, { $push: { Package: query.packageId } }, { new: true });
        //         if (result) {
        //             return {
        //                 statusCode: 200,
        //                 status: true,
        //                 message: "package added in new new cart Succesfuuly ! 1 ",
        //                 data: [result]
        //             };
        //         };
        //     } else {
        //         const findPackage = await package.findOne({ _id, saloonId: mongoose.Types.ObjectId(query.saloonId) });
        //         if (!findPackage) {
        //             return {
        //                 statusCode: 200,
        //                 status: true,
        //                 message: "not found package in your selected store !",
        //                 data: []
        //             };
        //         };

        //         const FindCart = await cart.findOne({ userId: user._id, saloonId: mongoose.Types.ObjectId(query.saloonId) });
        //         if (FindCart) {
        //             const result = await cart.findByIdAndUpdate({ _id: FindCart._id }, { $push: { Package: query.packageId } }, { new: true });
        //             if (result) {
        //                 return {
        //                     statusCode: 200,
        //                     status: true,
        //                     message: "package added in cart Succesfuuly ! 2 ",
        //                     data: [result]
        //                 };
        //             };
        //         } else {
        //             return {
        //                 statusCode: 400,
        //                 status: false,
        //                 message: "cart not Found register karwao !",
        //                 data: [FindCart]
        //             };
        //         };
        //     };
        // };
    } catch (error) {
        console.log(error);
    };
};

exports.removeCart = async ({ query }) => {
    try {
        const _id = mongoose.Types.ObjectId(query.id);
        const result = await cart.findByIdAndRemove({ _id })
        if (result) {
            return {
                statusCode: 200,
                status: true,
                message: "cart remove succesfully !",
                data: [result]
            };
        };
    } catch (error) {
        console.log(error);
    }
}
