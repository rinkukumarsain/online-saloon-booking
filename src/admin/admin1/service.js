const order = require("../../api/order/model")
const user = require("../../api/user/model");
const saloon = require("../../api/saloonstore/model");
const service = require("../../api/saloonService/model");
const payment = require("../../api/payment/model");
const PartnerRequist = require("../../api/Partner/model");
const Artice = require("../../api/artist/model");
const veconcy = require("../Vacancy/model");
// const

exports.AllDetail = async (req, res) => {
 try {
  let obj = {}
  const data = await this.Findpayment(req)
  if (data) {
   arr = []
   for (const item of data) {
    arr.push(item.orderData.amount / 100)
   }
   const sum = arr.reduce((acc, ele) => acc + ele, 0);
   obj.payment = sum
   obj.paymentCount = data.length
  };

  obj.order = await order.countDocuments()//{status:"cancel"}

  obj.user = await user.countDocuments({ type: "user" })
  obj.saloon = await saloon.countDocuments()
  obj.FindRequist = await PartnerRequist.countDocuments()
  obj.Findservice = await service.countDocuments({ ServicesType: 0 })
  obj.Findpackeges = await service.countDocuments({ ServicesType: 1 })




  return obj;
 } catch (errore) {
  console.log(errore);
 };
};

exports.Findpayment = async (req, res) => {
 try {
  let obj = {};
  if (req.query.dd != undefined && req.query.dd != "") {
   obj.name = req.query.dd;
  };
  obj.payment = "Payment successfull";
  const findData = await payment.find(obj, { "orderData.amount": 1 });
  return findData
  // res.send(findData);
 } catch (e) {
  console.log(e);
 };
};

/*

exports.Findorder = async (req, res) => {
 try {
  let obj = {};
  if (req.query.dd != undefined && req.query.dd != "") {
   obj.name = req.query.dd;
  };
  const findData = await order.find(obj);
  return findData
  // res.send(findData);
 } catch (e) {
  console.log(e);
 };
};

exports.Finduser = async (req, res) => {
 try {
  let obj = {};
  if (req.query.dd != undefined && req.query.dd != "") {
   obj.name = req.query.dd;
  };
  obj.type = "user"
  const findData = await user.find(obj);
  return findData
  // res.send(findData);
 } catch (e) {
  console.log(e);
 };
};

exports.Findsaloon = async (req, res) => {
 try {
  let obj = {};
  if (req.query.dd != undefined && req.query.dd != "") {
   obj.name = req.query.dd;
  };
  const findData = await saloon.find(obj);
  return findData
  // res.send(findData);
 } catch (e) {
  console.log(e);
 };
};

exports.Findservice = async (req, res) => {
 try {
  let obj = {};
  if (req.query.dd != undefined && req.query.dd != "") {
   obj.name = req.query.dd;
  };
  const findData = await service.find(obj);
  return findData
  // res.send(findData);
 } catch (e) {
  console.log(e);
 };
};



exports.FindPartnerRequist = async (req, res) => {
 try {
  let obj = {};
  if (req.query.dd != undefined && req.query.dd != "") {
   obj.name = req.query.dd;
  };
  const findData = await PartnerRequist.find(obj);
  return findData
  // res.send(findData);
 } catch (e) {
  console.log(e);
 };
};

exports.FindArtice = async (req, res) => {
 try {
  let obj = {};
  if (req.query.dd != undefined && req.query.dd != "") {
   obj.name = req.query.dd;
  };
  const findData = await Artice.find(obj);
  res.send(findData);
 } catch (e) {
  console.log(e);
 };
};

exports.Findveconcy = async (req, res) => {
 try {
  let obj = {};
  if (req.query.dd != undefined && req.query.dd != "") {
   obj.name = req.query.dd;
  };
  const findData = await veconcy.find(obj);
  res.send(findData);
 } catch (e) {
  console.log(e);
 };
};

*/



