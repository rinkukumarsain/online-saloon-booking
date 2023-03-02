const category = require("./model");

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
