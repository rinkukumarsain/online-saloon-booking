const refer = require("../../admin/Refer-And-point/model");
const user = require("../user/model");
const mongoose = require("mongoose");
const { referConvert } = require("./services")

exports.pointToMoneyConvert = async (req) => {
    try {
        let obj = {}
        if (req.user.userWallet.point > 0) {
            obj.userId = req.user._id
            if (req.query.id != undefined && req.query.id != "") {
                const referOfer = await refer.findOne({ _id: mongoose.Types.ObjectId(req.query.id) }, { rupee: 1, point: 1 });
                obj.referPlanId = referOfer._id
                if (referOfer.point <= req.user.userWallet.point) {
                    const FinduserAndUpdate = await user.findByIdAndUpdate({ _id: req.user._id }, { $inc: { "userWallet.balance": referOfer.rupee, "userWallet.point": -referOfer.point } }, { new: true });
                    if (FinduserAndUpdate) {
                        // trangacation save karna hai  hai 
                        const ConvertTra = await referConvert(obj)
                        if (ConvertTra) {
                            req.body = {};
                            req.body.userId = req.user._id;
                            req.body.moneyType = "balance";
                            req.body.type = "Add";
                            req.body.amount = referOfer.rupee;
                            req.body.status = "succes";
                            req.body.fromUserId = req.user._id;
                            req.body.description = "pointToMoney";
                            const dataSave = await this.walletTransaction(req)
                            // tragacation save dataSave
                            if (dataSave) {
                                return {
                                    statusCode: 200,
                                    status: true,
                                    message: `money Added in user Wallet !`,
                                    data: [FinduserAndUpdate]
                                };
                            };
                        };
                    } else {
                        return {
                            statusCode: 400,
                            status: false,
                            message: `samething is wrong !`,
                            data: []
                        };
                    }

                } else {
                    return {
                        statusCode: 400,
                        status: false,
                        message: `choice right  pakege !`,
                        data: []
                    };
                };
            } else {
                const Finddata = await refer.find({}, { rupee: 1, point: 1 })
                if (Finddata.length > 0) {
                    return {
                        statusCode: 200,
                        status: true,
                        message: `choice your convert pakege !`,
                        data: [Finddata]
                    };
                };
            };
        } else {
            return {
                statusCode: 400,
                status: false,
                message: `your  point Wallet is zero !`,
                data: []
            };
        };
    } catch (error) {
        console.log(error);
    };
};


const trangacation = require("../refer And ponts/wallthTra")
exports.walletTransaction = async (req) => {
    try {
        req.body.tragactionId = Math.random() * 1000000000000000
        Math.floor(req.body.tragactionId)
        const Deteil = new trangacation(req.body)
        const result = await Deteil.save()
        if (result) {
            return {
                statusCode: 200,
                status: true,
                message: `transaction  Succesfuuly !`,
                data: [result]
            };
        }

    } catch (error) {
        console.log(error);
    };
};