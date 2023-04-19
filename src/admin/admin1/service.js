const order = require("../../api/order/model")
const user = require("../../api/user/model");
const saloon = require("../../api/saloonstore/model");
const service = require("../../api/saloonService/model");
const payment = require("../../api/payment/model");
const PartnerRequist = require("../../api/Partner/model");
const Artice = require("../../api/artist/model");
const veconcy = require("../Vacancy/model");
// const



exports.Findorder = async (req, res) => {
 try {
  let obj = {};
  if (req.query.dd != undefined && req.query.dd != "") {
   obj.name = req.query.dd;
  };
  const findData = await order.find(obj);
  res.send(findData);
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
  const findData = await user.find(obj);
  res.send(findData);
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
  res.send(findData);
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
  res.send(findData);
 } catch (e) {
  console.log(e);
 };
};

exports.Findpayment = async (req, res) => {
 try {
  let obj = {};
  if (req.query.dd != undefined && req.query.dd != "") {
   obj.name = req.query.dd;
  };
  const findData = await payment.find(obj);
  res.send(findData);
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
  res.send(findData);
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





