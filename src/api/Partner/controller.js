const service = require("../saloonService/model");
const mongoose = require("mongoose");
const saloonRequst = require("./model");
// const saloonRequst = require("../saloonstore/model");

exports.PartnerRegistrationForm = async (req, res) => {
    try {
        let obj = {};
        let location = {};
        if (req.user) {
            obj.userId = req.user._id
        }
        if (req.body.Phone != undefined && req.body.Phone != "") {
            const finddata = await saloonRequst.findOne({ PhoneNumber: req.body.Phone })
            console.log("Phone", finddata)
            if (finddata) {
                return {
                    statusCode: 400,
                    status: false,
                    message: "wrong phone !",
                    data: [req.body]
                };
            }
            obj.PhoneNumber = req.body.Phone
        } else {
            const finddata = await saloonRequst.findOne({ PhoneNumber: req.user.phone })
            console.log("phone", 2, finddata, "-----", req.body.Phone)
            if (finddata) {
                return {
                    statusCode: 400,
                    status: false,
                    message: "wrong phone !",
                    data: [req.body]
                };
            }
            obj.PhoneNumber = req.user.phone
        }
        if (req.body.OwenerName != undefined && req.body.OwenerName != "") {
            obj.OwenerName = req.body.OwenerName
        }
        if (req.body.BrandName != undefined && req.body.BrandName != "") {
            const finddata = await saloonRequst.findOne({ storeName: req.body.BrandName })
            if (finddata) {
                return {
                    statusCode: 400,
                    status: false,
                    message: "wrong BrandName !",
                    data: [req.body]
                };
            }
            obj.storeName = req.body.BrandName
        }
        if (req.body.Gender != undefined && req.body.Gender != "") {
            obj.type = req.body.Gender
        }
        if (req.body.Email != undefined && req.body.Email != "") {
            const finddata = await saloonRequst.findOne({ Email: req.body.Email })
            if (finddata) {
                return {
                    statusCode: 400,
                    status: false,
                    message: "wrong Email !",
                    data: [req.body]
                };
            }
            obj.Email = req.body.Email
        }
        if (req.body.Password != undefined && req.body.Password != "" && req.body.ConfremPassword === req.body.Password) {
            obj.password = req.body.Password
        } else {
            return {
                statusCode: 200,
                status: true,
                message: "wrong password !",
                data: [req.body]
            };
        }

        if (req.body.PartnerSize != undefined && req.body.PartnerSize != "") {
            obj.PartnerSize = req.body.PartnerSize
        }
        if (req.body.category != undefined && req.body.category != "") {
            obj.category = req.body.category
        }

        if (req.body.shopNumber != undefined && req.body.shopNumber != "") {
            location.shopNumber = req.body.shopNumber
        }
        if (req.body.aria != undefined && req.body.aria != "") {
            location.aria = req.body.aria
        }
        if (req.body.pincode != undefined && req.body.pincode != "") {
            location.pincode = req.body.pincode
        }
        if (req.body.city != undefined && req.body.city != "") {
            location.city = req.body.city
        }
        if (req.body.state != undefined && req.body.state != "") {
            location.state = req.body.state
        }
        obj.location = location

        const saloonRequstDitail = new saloonRequst(obj)

        const result = await saloonRequstDitail.save()

        console.log("result", result)
        if (result) {
            return {
                statusCode: 200,
                status: true,
                message: "Your saloon requist create successfully !",
                data: [result]
            };
        }







        console.log("-->", obj)

    } catch (error) {
        console.log("error", error);
        throw error;
    }
}


