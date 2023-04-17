const mongoose = require("mongoose")
const package = require("../../admin/servicePackage/model")

exports.getServicePackage = async (query) => {
    try {
        const saloonId = mongoose.Types.ObjectId(query.saloonId);

        const condition = [];
        condition.push({
            '$lookup': {
                'from': 'saloonservices',
                'localField': 'Services',
                'foreignField': '_id',
                'as': 'Services'
            }
        }, {
            '$group': {
                '_id': '$saloonId',
                'ServicesDitail': {
                    '$push': {
                        'PackageName': '$PackageName',
                        'saloonId': '$saloonId',
                        'Services': '$Services',
                        'Amount': '$Amount',
                        'finalPrice': '$finalPrice',
                        'gender': '$gender',
                        'Service': '$Service'
                    }
                }
            }
        }, {
            '$lookup': {
                'from': 'saloons',
                'localField': '_id',
                'foreignField': '_id',
                'as': 'saloon'
            }
        });



        const findData = await package.aggregate(condition);
        if (findData.length > 0) {
            return {
                statusCode: 200,
                status: true,
                message: "reviews  find successfull !",
                data: findData
            };
        } else {
            return {
                statusCode: 400,
                status: false,
                message: "reviews  not find  !",
                data: []
            };
        }
    } catch (error) {
        console.log(error);
        throw error;
    };
};