const { default: mongoose } = require("mongoose");
const saloon = require("../../api/saloonstore/model");

exports.VIEW_SALOON = async (req) => {
  try {
    console.log("req.user",)

    let match = {}
    if (req.query.city != undefined && req.query.city != "") {
      match['location.city'] = req.query.city
    }
    if (req.query.Phone != undefined && req.query.Phone != "") {
      match.Phone = { $eq: Number(req.query.Phone) }
    }
    if (req.query.email != undefined && req.query.email != "") {
      match.email = { $regex: req.query.email, $options: 'i' }
    }
    if (req.query.userId != undefined && req.query.userId != "") {
      match.userId = mongoose.Types.ObjectId(req.query.userId)
    }
    if (req.user.type == "admin") {
      match.userId = req.user._id
    }

    let pipeline = [];
    pipeline.push({
      '$match': match
    })


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
    pipeline.push({
      '$lookup': {
        'from': 'saloonservices',
        'localField': '_id',
        'foreignField': 'saloonStore',
        'pipeline': [
          {
            '$count': 'numberOfService'
          }
        ],
        'as': 'Service'
      }
    })
    return await saloon.aggregate(pipeline)
  } catch (error) {
    console.log(error)
  }
}