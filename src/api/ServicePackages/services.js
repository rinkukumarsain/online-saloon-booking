const mongoose = require("mongoose")
const package = require("../../admin/servicePackage/model")

exports.getServicePackage = async (query) => {
    try {
        const condition = [];
        if (query.categoryId != undefined && query.categoryId != "") {
            condition.push({
                '$match': {
                    'PackageCotegory': mongoose.Types.ObjectId(query.categoryId)
                }
            });
        };

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
                        'PackageId':"$_id",
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
                message: "package  find successfull !",
                data: findData
            };
        } else {
            return {
                statusCode: 400,
                status: false,
                message: "package  not find  !",
                data: []
            };
        };
    } catch (error) {
        console.log(error);
    };
};