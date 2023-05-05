const saloon = require("../saloonstore/model");
const saloonRequst = require("../../api/Partner/model");
const mongoose = require("mongoose");


exports.UpdateSaloon = async ({ body, query }) => {
 try {
  let findData;
  let findSaloonRequst;
  findSaloonRequst = await saloonRequst.findOne({ _id: mongoose.Types.ObjectId(query.id) });
  const findSaloon = await saloon.findOne({ _id: mongoose.Types.ObjectId(query.id) });
  if (findSaloonRequst) {
   findData = findSaloonRequst;
  } else {
   findData = findSaloon;
  };
  const { aria, pincode, city, state, ...rest } = body;
  let location = {};

  location.aria = aria;
  location.pincode = pincode;
  location.city = city;
  location.state = state;
  rest.location = location;


  let update;
  if (findSaloonRequst) {
   update = await saloonRequst.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(query.id) }, rest);
  } else {
   update = await saloon.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(query.id) }, rest);
  };

  if (update) {
   return {
    statusCode: 200,
    status: true,
    message: "saloon update successfully step-1",
    data: [update]
   };
  } else {
   return {
    statusCode: 400,
    status: false,
    message: "samthing is wroung step-1",
    data: []
   };
  };
 } catch (error) {
  console.log(error);
 };
};