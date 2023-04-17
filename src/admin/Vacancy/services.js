const { default: mongoose } = require("mongoose");
const vacancy = require("./model");

exports.ViewVacancy = async (req) => {
    let pipeline = [];
    if (req.query.id != undefined && req.query.id != "") {
        pipeline.push({
            '$match': {
                '_id': mongoose.Types.ObjectId(req.query.id)
            }
        })
    }
    pipeline.push({
        '$lookup': {
            'from': 'users',
            'localField': 'userId',
            'foreignField': '_id',
            'as': 'user'
        }
    }, {
        '$unwind': {
            'path': '$user'
        }
    }, {
        '$lookup': {
            'from': 'categories',
            'localField': 'category',
            'foreignField': '_id',
            'as': 'category'
        }
    }, {
        '$lookup': {
            'from': "saloonservices",
            'localField': "forService",
            'foreignField': "_id",
            'as': "Service"
        }
    })
    /* , {
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
     })*/

    return await vacancy.aggregate(pipeline)
}