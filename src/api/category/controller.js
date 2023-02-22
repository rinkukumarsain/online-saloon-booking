const category = require("./model");
const service = require("../saloonService/model");

exports.getCategoryListing = async ({ query }) => {
    try {
        let condition = {};
        if (query.id) {
            condition = { _id: query.id };
        } else {
            condition = { parent_Name: null };
        };
        const FindData = await category.find(condition);
        if (FindData.length > 0) {
            return {
                statusCode: 200,
                status: true,
                message: "successfull!",
                data: FindData
            };
        } else {
            return {
                statusCode: 200,
                status: true,
                message: "noData !",
                data: []
            };
        };
    } catch (error) {
        console.log(error);
        throw error;
    };
};

exports.getAllCategoryListing = async () => {
    try {
        let parent = [];
        let child = [];
        const FindData = await category.find();

        FindData.forEach((item) => {
            if (item.parent_Name == null) return parent.push(item);
            if (item.parent_Name) return child.push(item);
        })

        function getDinamicCategory(parent, child) {
            for (pdata of parent) {
                pdata._doc.subchild = []
                for (cdata of child) {
                    if (cdata.parent_Name.toString() === pdata._id.toString()) {
                        pdata._doc.subchild.push(cdata);
                    }
                }
                if (pdata._doc.subchild != null) {
                    getDinamicCategory(pdata._doc.subchild, child);
                }
            }
        }
        getDinamicCategory(parent, child);
        return {
            statusCode: 200,
            status: true,
            message: "successfull !",
            data: parent
        };
    } catch (error) {
        console.log(error);
        throw error;
    };
};



exports.getServiceByCategory = async ({ query }) => {
    try {
        if (query.id) {
            let arrr = []
            let _id = query.id;
            const findCategory = await category.findOne({ _id });
            if (findCategory) {
                const findsubCategory = await category.find({ parent_Name: findCategory._id });
                if (findsubCategory.length > 0) {
                    for (const item of findsubCategory) {
                        const condition = [];
                        condition.push({
                            '$match': {
                                'last_category': item._id
                            }
                        });

                        condition.push({
                            '$lookup': {
                                'from': 'saloons',
                                'localField': 'saloonStore',
                                'foreignField': '_id',
                                'as': 'result'
                            }
                        });

                        condition.push({
                            '$unwind': {
                                'path': '$result'
                            }
                        });

                        condition.push({
                            '$project': {
                                'saloonStore': 1,
                                'storeLOcation': '$result.location',
                                'storeName': '$result.storeName',
                                'ServiceName': 1,
                                'ServicePrice': 1,
                                'image': 1,
                                'description': 1,
                                'last_category': 1,
                                'category': 1,
                                'timePeriod': 1,
                                'timePeriod_in_minits': 1,
                                'serviceProvider': 1,
                                'updatedA': 1
                            }
                        });

                        const findService = await service.aggregate(condition);
                        if (findService) {
                            arrr.push(findService)
                        };
                    }
                    if (arrr && arrr.length > 0) {
                        return {
                            statusCode: 200,
                            status: true,
                            message: "Find Service successfull !",
                            data: arrr
                        };
                    } else {
                        return {
                            statusCode: 400,
                            status: false,
                            message: "Service Not Found   !",
                            data: arrr
                        };
                    }


                } else {
                    console.log("subcatory not found ")
                }

            } else {
                return {
                    statusCode: 400,
                    status: false,
                    message: "Please Enter Valid Category id !",
                    data: []
                };
            };
        } else {
            return {
                statusCode: 400,
                status: false,
                message: "Please Enter Category id !",
                data: []
            };
        };
    } catch (error) {
        console.log(error);
        throw error;
    };
};