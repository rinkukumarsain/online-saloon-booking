const { default: mongoose } = require("mongoose");
const blog = require("../../api/blogs/model");

exports.VIEW_BLOG = async (req) => {
    let pipeline = [];
    let obj = {};
    if (req.query?.Category) { obj.category = mongoose.Types.ObjectId(req.query?.Category) };
    if (req.query?.WriterName) { obj.WriterName = req.query.WriterName };
    if (req.query?.Title) { obj.Title = { '$regex': req.query.Title, $options: 'i' } };
    pipeline.push({ $match: obj });

    pipeline.push({
        '$lookup': {
            'from': 'categories',
            'localField': 'category',
            'foreignField': '_id',
            'as': 'result'
        }
    }, {
        '$lookup': {
            'from': 'faqs',
            'localField': '_id',
            'foreignField': 'blogId',
            'pipeline': [
                {
                    '$count': 'count'
                }
            ],
            'as': 'faq'
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