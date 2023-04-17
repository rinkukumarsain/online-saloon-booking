const user = require("../user/model");
const artist = require("../artist/model");
const saloonService = require("../saloonService/model")
const order = require("../order/model")
const saloon = require("../saloonstore/model")
const reviews = require("../reviews/model")
const { getAllSaloonCity } = require("../saloonstore/controller")


const mongoose = require("mongoose");


exports.AboutUs = async (req) => {
 try {
  let obj = {}
  const finduser = await user.countDocuments();
  obj.Toteluser = finduser;
  const findartist = await artist.countDocuments();
  obj.Totelartist = findartist;
  const findsaloonService = await saloonService.countDocuments();
  obj.TotelsaloonService = findsaloonService;
  const findorder = await order.countDocuments();
  obj.Totelorder = findorder;
  const findsaloon = await saloon.countDocuments();
  obj.Totelsaloon = findsaloon;
  const findreviews = await reviews.countDocuments();
  obj.Totelreviews = findreviews;
  const totelCity = await getAllSaloonCity(req);
  if (totelCity) {
   obj.citys = totelCity.data.length;
  };
  if (obj) {
   return {
    statusCode: 200,
    status: true,
    message: "about us Data is hare !",
    data: [obj]
   };
  };
 } catch (error) {
  console.log(error);
 };
};