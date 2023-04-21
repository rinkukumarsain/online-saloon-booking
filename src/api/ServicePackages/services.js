const mongoose = require("mongoose")
const package = require("../../admin/servicePackage/model")
const services = require("../saloonService/model")
exports.getServicePackage = async (query) => {
    try {
        const condition = [];

        if (query.categoryId != undefined && query.categoryId != "") {
            condition.push({
                '$match': {
                    'category': {
                        '$in': [mongoose.Types.ObjectId(query.categoryId)],
                    },
                }
            });
        } else {
            condition.push({
                '$match': {
                    'ServicesType': 1
                }
            })
        }


        condition.push({
            '$lookup': {
                'from': 'saloons',
                'localField': 'saloonStore',
                'foreignField': '_id',
                'as': 'saloonStore'
            }
        }, {
            '$unwind': {
                'path': '$saloonStore'
            }
        }, {
            '$lookup': {
                'from': 'saloonservices',
                'localField': 'Services',
                'foreignField': '_id',
                'pipeline': [
                    {
                        '$project': {
                            'ServiceName': 1
                        }
                    }
                ],
                'as': 'servicename'
            }
        }, {
            '$group': {
                '_id': '$saloonStore._id',
                'service': {
                    '$push': {
                        '_id': '$_id',
                        'ServiceName': '$ServiceName',
                        'ServicePrice': '$ServicePrice',
                        'timePeriod_in_minits': '$timePeriod_in_minits',
                        'type': '$type',
                        'ServicesType': '$ServicesType',
                        'ServicePrice': '$ServicePrice',
                        'FinalPrice': '$FinalPrice',
                        'description': '$description',
                        'ServicesName':'$servicename'
                    }
                },
                'saloon': {
                    '$addToSet': {
                        '_id': '$saloonStore._id',
                        'storeName': '$saloonStore.storeName',
                        'location': '$saloonStore.location',
                        'image': '$saloonStore.image'
                    }
                }
            }
        });
        const findData = await services.aggregate(condition);
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