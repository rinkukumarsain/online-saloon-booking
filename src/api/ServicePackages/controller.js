const cart = require("../cart/model");
const package = require("../../admin/servicePackage/model");
const mongoose = require("mongoose")
const { getServicePackage } = require("./services")

exports.getServicePackage = async ({ query, user }) => {
    try {
        query.user = user
        const result = await getServicePackage(query);
        if (result) {
            return result
        }
    } catch (error) {
        console.log(error);
    };
};


// exports.packageCartAdd = async ({ user, query }) => {
//     try {
//         let obj = {};
//         let newCart;
//         let i;
//         const findData = await cart.find({ userId: user._id });
//         if (findData.length == 0) {
//             obj.userId = user._id;
//             if (query.saloonId) {
//                 let _id = mongoose.Types.ObjectId(query.saloonId);
//                 const findSaloon = await saloon.findOne({ _id });
//                 if (findSaloon) {
//                     obj.saloonId = query.saloonId;
//                 } else {
//                     return {
//                         statusCode: 400,
//                         status: false,
//                         message: "Enter Valid saloon Id !",
//                         data: []
//                     };
//                 };
//             };
//             let cart_detail = new cart(obj);
//             const result = await cart_detail.save();

//         } else if (findData.length > 0) {
//             const findccc = await cart.findOne({ userId: user._id, saloonId: mongoose.Types.ObjectId(query.saloonId) });
//             i = 1;
//             if (!findccc) {
//                 for await (const element of findData) {
//                     if (query.saloonId != element.saloonId.toString() && i === 1) {
//                         obj.userId = user._id;
//                         obj.saloonId = query.saloonId;
//                         let cart_detail = new cart(obj);
//                         newCart = await cart_detail.save();
//                         i++
//                     };
//                 };
//             };
//         };

//         //same code hai Add cart mwe bhi service aur pakege me bhi ;
//         if (query.packageId) {
//             let _id = mongoose.Types.ObjectId(query.packageId);
//             if (newCart) {
//                 findPackage = await package.findOne({ _id, saloonStore: newCart.saloonId });
//                 if (!findPackage) {
//                     return {
//                         statusCode: 400,
//                         status: false,
//                         message: "package is  not Found this Saloon store  !",
//                         data: []
//                     };
//                 };
//                 const FindCart = await cart.findOne({ userId: user._id, saloonId: mongoose.Types.ObjectId(query.saloonId) });

//                 const result = await cart.findByIdAndUpdate({ _id: FindCart._id }, { $push: { Package: { packageId: query.packageId, quantity: 1 } } }, { new: true });
//                 if (result) {
//                     return {
//                         statusCode: 200,
//                         status: true,
//                         message: "package added in new new cart Succesfuuly ! 1 ",
//                         data: [result]
//                     };
//                 };
//             } else {
//                 const findPackage = await package.findOne({ _id, saloonId: mongoose.Types.ObjectId(query.saloonId) });
//                 if (!findPackage) {
//                     return {
//                         statusCode: 200,
//                         status: true,
//                         message: "not found package in your selected store !",
//                         data: []
//                     };
//                 };

//                 const FindCart = await cart.findOne({ userId: user._id, saloonId: mongoose.Types.ObjectId(query.saloonId) });
//                 if (FindCart) {
//                     const result = await cart.findByIdAndUpdate({ _id: FindCart._id }, { $push:  { Package: { packageId: query.packageId, quantity: 1 } }  }, { new: true });
//                     if (result) {
//                         return {
//                             statusCode: 200,
//                             status: true,
//                             message: "package added in cart Succesfuuly ! 2 ",
//                             data: [result]
//                         };
//                     };
//                 } else {
//                     return {
//                         statusCode: 400,
//                         status: false,
//                         message: "cart not Found register karwao !",
//                         data: [FindCart]
//                     };
//                 };
//             };
//         };
//     } catch (error) {
//         console.log(error);
//     };
// };
