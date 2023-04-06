const vacancy = require("./model");

exports.ViewVacancy = async () => {
    let pipeline = [];
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