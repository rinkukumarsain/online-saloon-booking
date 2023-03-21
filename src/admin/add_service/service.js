const saloonService = require("../../api/saloonService/model")

exports.VIEW_SALOON = async () => {
  let pipeline = []

  pipeline.push({
    '$lookup': {
      'from': 'saloons',
      'localField': 'saloonStore',
      'foreignField': '_id',
      'as': 'saloon_data'
    }
  }, {
    '$lookup': {
      'from': 'categories',
      'localField': 'last_category',
      'foreignField': '_id',
      'as': 'last_category_data'
    }
  }, {
    '$addFields': {
      'saloon_name': {
        '$getField': {
          'field': 'storeName',
          'input': {
            '$arrayElemAt': [
              '$saloon_data', 0
            ]
          }
        }
      },
      'last_category_name': {
        '$getField': {
          'field': 'Name',
          'input': {
            '$arrayElemAt': [
              '$last_category_data', 0
            ]
          }
        }
      }
    }
  })
  return await saloonService.aggregate(pipeline)
}