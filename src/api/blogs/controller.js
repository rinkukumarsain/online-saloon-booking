const blog = require("./model")
const category = require("../category/model")
const mongoose = require("mongoose")


exports.creatBlog = async ({ body, file }) => {
    try {
        let obj = {};
        if (file) {
            obj.image = file.filename;
        }
        if (body.category != "" && body.category != undefined) {
            let _id = mongoose.Types.ObjectId(body.category);
            const findCategory = await category.findOne({ _id });
            if (findCategory) {
                obj.category = findCategory._id;
                if (body.Title != "" && body.Title != undefined) {
                    let Title = body.Title;
                    const findBlog = await blog.findOne({ category: findCategory._id, Title: body.Title });
                    if (findBlog) {
                        return {
                            statusCode: 400,
                            status: false,
                            message: `Tital Name Is Allready Exit In This Catogory(${findCategory.Name}) !`,
                            data: []
                        };
                    } else {
                        obj.Title = body.Title;
                        if (body.WriterName != "" && body.WriterName != undefined) {
                            obj.WriterName = body.WriterName;
                            if (body.Description != "" && body.Description != undefined) {
                                obj.Description = body.Description;
                                const blogDetails = new blog(obj);
                                const result = await blogDetails.save();
                                if (result) {
                                    return {
                                        statusCode: 200,
                                        status: true,
                                        message: "Blog  Register successfull !",
                                        data: [result]
                                    };
                                };
                            } else {
                                return {
                                    statusCode: 400,
                                    status: false,
                                    message: "Please Enter Valid Description !",
                                    data: []
                                };
                            };
                        } else {
                            return {
                                statusCode: 400,
                                status: false,
                                message: "Please Enter Valid WriterName !",
                                data: []
                            };
                        };
                    };
                } else {
                    return {
                        statusCode: 400,
                        status: false,
                        message: "Please Enter Valid Title !",
                        data: []
                    };
                };
            } else {
                return {
                    statusCode: 400,
                    status: false,
                    message: "invalid Category id !",
                    data: []
                };
            };
        } else {
            return {
                statusCode: 400,
                status: false,
                message: "please Enter Category id !",
                data: []
            };
        };
    } catch (error) {
        console.log(error);
        throw error;
    };
};

exports.getAllBlog = async ({ query }) => {
    try {
        let condition = {};
        if (query.id) {
            condition.category = mongoose.Types.ObjectId(query.id);
            const findCategory = await category.findOne({ _id: mongoose.Types.ObjectId(query.id) });
            if (!findCategory) {
                return {
                    statusCode: 200,
                    status: true,
                    message: "Plese enter Valid category Id !",
                    data: []
                };
            };
        };
        const result = await blog.find(condition);
        if (result) {
            return {
                statusCode: 200,
                status: true,
                message: "blog is hare successfull!",
                data: [result]
            };
        } else {
            return {
                statusCode: 400,
                status: false,
                message: "Blog Data Not Found !",
                data: []
            };
        };
    } catch (error) {
        console.log(error);
        throw error;
    };
};
