const saloon = require("../../api/saloonstore/model");

exports.VIEW_SALOON = async () => {
  let pipeline = []
  pipeline.push({
    '$lookup': {
      'from': 'users',
      'localField': 'userId',
      'foreignField': '_id',
      'pipeline': [
        {
          '$project': {
            'name': 1
          }
        }
      ],
      'as': 'result'
    }
  }, {
    '$addFields': {
      'name': {
        '$getField': {
          'field': 'name',
          'input': {
            '$arrayElemAt': [
              '$result', 0
            ]
          }
        }
      }
    }
  })

  return await saloon.aggregate(pipeline)
}