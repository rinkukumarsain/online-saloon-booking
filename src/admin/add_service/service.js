const saloonService = require("../../api/saloonService/model")
const mongoose = require("mongoose")

exports.VIEW_SALOON = async (req) => {
  let pipeline = []

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
  match.ServicesType = 0

  pipeline.push({
    '$match': match
  })

  if (req.user.type == "admin") {
    pipeline.push({
      '$lookup': {
        'from': 'saloons',
        'localField': 'saloonStore',
        'foreignField': '_id',
        pipeline: [
          {
            '$match': {
              'userId': req.user._id
            }
          }
        ],
        'as': 'saloon_data'
      }
    })
  } else {
    pipeline.push({
      '$lookup': {
        'from': 'saloons',
        'localField': 'saloonStore',
        'foreignField': '_id',
        'as': 'saloon_data'
      }
    })
  }

  if (req.query.CategoryName != undefined && req.query.CategoryName != "") {
    pipeline.push({
      '$lookup': {
        'from': 'categories',
        'localField': 'last_category',
        'foreignField': '_id',
        'pipeline': [
          {
            '$match': {
              'Name': {
                '$regex': req.query.CategoryName, $options: 'i'
              }
            }
          }
        ],
        'as': 'last_category_data'
      }
    })
  } else {
    pipeline.push({
      '$lookup': {
        'from': 'categories',
        'localField': 'last_category',
        'foreignField': '_id',
        'as': 'last_category_data'
      }
    })
  }
  pipeline.push({
    '$unwind': {
      'path': '$last_category_data',
      'preserveNullAndEmptyArrays': true
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

  if (req.user.type == "admin") {
    pipeline.push({
      '$match': {
        'saloon_name': {
          '$exists': true
        }
      }
    })
  }

  return await saloonService.aggregate(pipeline)
}