const category = require("./model")
const service = require("../saloonService/model")

exports.getCategoryListing = async (req, res) => {
    try {
        let condition = {}
        if (req.query.id) {
            condition = { _id: req.query.id };
        } else {
            condition = { parent_Name: null };
        }
        const FindData = await category.find(condition)
        if (FindData.length > 0) {
            return {
                statusCode: 200,
                status: true,
                message: "successfull!",
                data: FindData
            }
        } else {
            return {
                statusCode: 200,
                status: true,
                message: "noData !",
                data: []
            }
        }

    } catch (error) {
        console.log("getCategoryListing", error)
        throw error
    }
}

exports.getAllCategoryListing = async (req, res) => {
    try {
        let parent = []
        let child = []
        const FindData = await category.find()

        FindData.forEach((item) => {
            if (item.parent_Name == null) return parent.push(item)
            if (item.parent_Name) return child.push(item)
        })

        function getDinamicCategory(parent, child) {
            for (pdata of parent) {
                pdata._doc.subchild = []
                for (cdata of child) {
                    if (cdata.parent_Name.toString() === pdata._id.toString()) {
                        pdata._doc.subchild.push(cdata)
                    }
                }
                if (pdata._doc.subchild != null) {
                    getDinamicCategory(pdata._doc.subchild, child)
                }
            }
        }
        getDinamicCategory(parent, child);
        return {
            statusCode: 200,
            status: true,
            message: "successfull !",
            data: parent
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}



exports.getServiceByCategory = async ({ query }) => {
    try {
        if (query.id) {
            let _id = query.id
            const findCategory = await category.findOne({ _id })
            if (findCategory) {
                let last_category = findCategory._id
                const findService = await service.find({ last_category })
                if (findService) {
                    return {
                        statusCode: 200,
                        status: true,
                        message: "Find Service successfull !",
                        data: findService
                    }
                }
            } else {
                return {
                    statusCode: 400,
                    status: false,
                    message: "Please Enter Valid Category id !",
                    data: []
                }
            }
        } else {
            return {
                statusCode: 400,
                status: false,
                message: "Please Enter Category id !",
                data: []
            }
        }
    } catch (error) {
        console.log(error);
        throw error
    }
}