const cart = require("../cart/model");
const package = require("../../admin/servicePackage/model");
const mongoose = require("mongoose")
const { getServicePackage } = require("./services")

exports.getServicePackage = async ({ query, user }) => {
    try {
        query.user = user;
        const result = await getServicePackage(query);

        for (const item of result.data) {
            const findCart = await cart.findOne({ userId: query.user._id, saloonId: item.saloon[0]._id });
            if (findCart) {
                for (const servi of item.service) {
                    let i = 0;
                    for (const cartItem of findCart.cartdata) {
                        if (servi._id.toString() == cartItem.serviceId.toString()) {
                            i++;
                        };
                    };
                    servi.Quantity_In_Cart = i;
                };
            } else {
                for (const servi of item.service) {
                    let i = 0;
                    servi.Quantity_In_Cart = i;
                };
            };
        };

        if (result) {
            return result
        }
    } catch (error) {
        console.log(error);
    };
};
