const order = require("../../api/order/model")


exports.getAllOrder = async (req) => {
    try {
        let obj = {};
        match = {}
        let condition = [];
        if (req.query.status != undefined && req.query.status != "") {
            match.status = req.query.status
        }



        if (req.query.totalamount != undefined && req.query.totalamount != "") {
            match.totalamount = { $gt: Number(req.query.totalamount) }
        } else {
            match.totalamount = { $gt: 0 }
        }

        if (match.totalamount != undefined || match.status != undefined) {
            condition.push({
                '$match': match
            })
        }

        condition.push({
            '$lookup': {
                'from': 'saloons',
                'localField': 'saloonId',
                'foreignField': '_id',
                'as': 'saloon'
            }
        }, {
            '$lookup': {
                'from': 'users',
                'localField': 'userId',
                'foreignField': '_id',
                'pipeline': [
                    {
                        '$project': {
                            'name': 1,
                            'phone': 1,
                            'email': 1
                        }
                    }
                ],
                'as': 'users'
            }
        }, {
            '$unwind': {
                'path': '$users'
            }
        }, {
            '$unwind': {
                'path': '$saloon'
            }
        })

        if (req.query.city != undefined && req.query.city != "") {
            condition.push({
                '$lookup': {
                    'from': 'saloonId',
                    'localField': 'saloonId',
                    'foreignField': '_id',
                    'pipeline': [
                        {
                            '$match': {
                                'location.city': 'jaipur'
                            }
                        }, {
                            '$project': {
                                'city': '$location.city'
                            }
                        }
                    ],
                    'as': 'saloon'
                }
            }, {
                '$unwind': {
                    'path': '$saloon'
                }
            }
            )
        }

        const data = await order.aggregate(condition)
        if (data.length > 0) {
            return {
                statusCode: 200,
                status: true,
                message: "service added in cart Succesfuuly !",
                data: data
            };
        } else {
            return {
                statusCode: 400,
                status: false,
                message: "service not Found !",
                data: []
            };
        }
    } catch (error) {
        console.log(error);
    };
};