const saloonService = require("../../api/saloonService/model")
const mongoose = require("mongoose")
exports.VIEW_SALOON = async (req) => {
  let pipeline = []
  // res.locals.message = req.flash();
  let match = {}
  if (req.query.ServicePrice != undefined && req.query.ServicePrice != "") {
    match.ServicePrice = { $gt: Number(req.query.ServicePrice) }
  }
  if (req.query.ServiceName != undefined && req.query.ServiceName != "") {
    match.ServiceName = { $regex: req.query.ServiceName }
  }

  if (req.query.id != undefined && req.query.id != "") {
    match.saloonStore = mongoose.Types.ObjectId(req.query.id)
  }
  pipeline.push({
    '$match': match
  })

  pipeline.push({
    '$lookup': {
      'from': 'saloons',
      'localField': 'saloonStore',
      'foreignField': '_id',
      'as': 'saloon_data'
    }
  })
  pipeline.push({
    '$lookup': {
      'from': 'categories',
      'localField': 'last_category',
      'foreignField': '_id',
      'as': 'last_category_data'
    }
  })
  pipeline.push({
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
  if (req.query.StoreName != undefined && req.query.StoreName != "") {
    pipeline.push({
      '$match': {
        'saloon_name': {
          '$regex': req.query.StoreName, $options: 'i'
        }
      }
    })
  }

  return await saloonService.aggregate(pipeline)
}