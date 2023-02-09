const categoryModule = require("./model")

let i = 0;
var obj = {}
exports.getCategory = async (req) => {
    try {
        const data = req.data
        async function getDinamicCategory(data) {
            for await (const element of data) {
                i++
                const Sub_Category = await categoryModule.find({ parent_Name: element._id }, { __v: 0 })
                if (Sub_Category.length > 0) {
                    obj[element.Name] = Sub_Category;
                    data = Sub_Category
                    getDinamicCategory(data)
                }
                else {
                    obj[element.Name] = [];
                    //  console.log("---objbbbb----", obj, i)
                    return obj;
                }
            }
        }
        await getDinamicCategory(data)
        return {
            statusCode: 200,
            status: true,
            message: "successfull!",
            data: [obj]
        }
    } catch (error) {
        console.log("---objbbbb----", error)
    }
}

