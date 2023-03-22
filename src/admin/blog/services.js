const blog = require("../../api/blogs/model");

exports.VIEW_BLOG = async () => {
    let pipeline = [];
    pipeline.push({
        '$lookup': {
            'from': 'categories',
            'localField': 'category',
            'foreignField': '_id',
            'as': 'result'
        }
    }, {
        '$addFields': {
            'category_name': {
                '$getField': {
                    'field': 'Name',
                    'input': {
                        '$arrayElemAt': [
                            '$result', 0
                        ]
                    }
                }
            },
        }
    })

    return await blog.aggregate(pipeline)
}