
const categoryModule = require("./model")
const { getCategory } = require("./services")

exports.getCategoryListing = async (req, res) => {
    try {
        let condition = {}
        if (req.query.id) {
            condition = { _id: req.query.id };
        } else {
            condition = { parent_Name: null };
        }
        const FindData = await categoryModule.find(condition)
        if (FindData.length > 0) {
            return {
                statusCode: 200,
                status: true,
                message: "successfull!",
                data: [FindData]
            }
        } else {
            return {
                statusCode: 200,
                status: true,
                message: "noData!",
                data: []
            }
        }

    } catch (error) {
        console.log("getCategoryListing", error)
    }
}


exports.getAllCategoryListing = async (req, res) => {
    try {
        const FindData = await categoryModule.find({ parent_Name: null })
        req.data = FindData
        const result = await getCategory(req)
        if (result) {
            return {
                statusCode: 200,
                status: true,
                message: "successfull!",
                data: [result.data]
            }
        } else {
            return {
                statusCode: 200,
                status: true,
                message: "no data",
                data: ["no data"]
            }
        }
    } catch (error) {
        console.log("GetAllCategoryListing", error)
    }
}
