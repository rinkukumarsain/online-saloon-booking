const saloonservice = require("../saloonService/model")
const mongoose = require("mongoose");
const cart = require("./model");

exports.cartRegistration = async ({ body, user, query }) => {
    try {
        let obj = {};
        let arr = [];
        let totalamount = [];
        const findData = await cart.findOne({ userId: user._id });
        if (!findData) {
            obj.userId = user._id;
            if (body.saloonId) {
                obj.saloonId = mongoose.Types.ObjectId(body.saloonId);
            };
            if (body.cartData.length > 0) {
                for await (const item of body.cartData) {
                    let cartdata = {};
                    let _id = item.serviceId;
                    const finddata = await saloonservice.findOne({ _id: item.serviceId });
                    cartdata.serviceId = finddata._id;
                    cartdata.quantity = item.quantity;
                    cartdata.Amount = item.quantity * finddata.ServicePrice;
                    cartdata.timePeriod_in_minits = finddata.timePeriod_in_minits;
                    arr.push(cartdata);
                    totalamount.push(cartdata.Amount);
                };
                obj.cartdata = arr;
            }
            const sum = totalamount.reduce(add, 0);
            function add(accumulator, a) {
                return accumulator + a;
            }
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
                    obj.saloonId = mongoose.Types.ObjectId(body.saloonId);
                };
                if (body.cartData.length > 0) {
                    for await (const item of body.cartData) {
                        let cartdata = {};
                        let _id = item.serviceId;
                        const finddata = await saloonservice.findOne({ _id: item.serviceId });
                        cartdata.serviceId = finddata._id;
                        cartdata.quantity = item.quantity;
                        cartdata.Amount = item.quantity * finddata.ServicePrice;
                        cartdata.timePeriod_in_minits = finddata.timePeriod_in_minits;
                        arr.push(cartdata);
                        totalamount.push(cartdata.Amount);
                    };
                    obj.cartdata = arr;
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
                        message: "Cart-Is-Allready-Register-servish-added !",
                        data: [result]
                    };
                };
            } else {
                return {
                    statusCode: 400,
                    status: false,
                    message: "Cart-Is-Allready fg -Register !",
                    data: [findData]
                };
            };
        };
    } catch (error) {
        console.log(error);
        throw error;
    };
};

exports.editCart = async ({ body, user, query }) => {
    try {
        let obj = {};
        let arr = [];
        let totalamount = [];
        if (query.id) {
            const _id = mongoose.Types.ObjectId(query.id);
            const findData = await cart.findOne({ _id });
            if (findData) {
                if (body.saloonId) {
                    obj.saloonId = mongoose.Types.ObjectId(body.saloonId);
                };

                if (body.cartData.length > 0) {
                    for await (const item of body.cartData) {
                        let cartdata = {};
                        let _id = item.serviceId;
                        const finddata = await saloonservice.findOne({ _id: item.serviceId });
                        cartdata.serviceId = finddata._id;
                        cartdata.quantity = item.quantity;
                        cartdata.Amount = item.quantity * finddata.ServicePrice;
                        cartdata.timePeriod_in_minits = finddata.timePeriod_in_minits;
                        arr.push(cartdata);
                        totalamount.push(cartdata.Amount);
                    };
                    obj.cartdata = arr;
                }
                const sum = totalamount.reduce(add, 0);
                function add(accumulator, a) {
                    return accumulator + a;
                }
                obj.totalamount = sum;

                const result = await cart.findByIdAndUpdate({ _id }, { $set: obj }, { new: true });
                if (result) {
                    return {
                        statusCode: 200,
                        status: true,
                        message: "User-Cart-update- Succesfuuly !",
                        data: [result]
                    };
                };
            } else {
                return {
                    statusCode: 400,
                    status: false,
                    message: "please-Enter-valid-Cart-Id !",
                    data: []
                };
            };
        };
    } catch (error) {
        console.log(error);
        throw error;
    }
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
                        for (const item of findData.cartdata) {
                            if (item.serviceId.toString() != query.serviceId) {
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
                };
            } else {
                return {
                    statusCode: 200,
                    status: true,
                    message: "Please-Enter-valide-Cart-Id !",
                    data: []
                };
            };
        } else {
            return {
                statusCode: 400,
                status: false,
                message: "please-Enter-valid-Cart-Id !",
                data: []
            };
        };
    } catch (error) {
        console.log(error);
        throw error;
    };
};