const referTransaction = require("./modelTra")
const mongoose = require("mongoose")

exports.referConvert = async (obj) => {
 try {
  const TransactionDetail = new referTransaction(obj)
  const result = await TransactionDetail.save()
  if (result) {
   return {
    statusCode: 200,
    status: true,
    message: "Transaction Detail  Save  successfull !",
    data: result
   };
  };
 } catch (error) {
  console.log(error);
 };
};