
const city = require("./module");

exports.getStates = async (req, res) => {
 try {
  const data = await city.distinct("State");
  return {
   statusCode: 200,
   status: true,
   message: "Find State Succesfully ",
   data: data
  };
 } catch (erore) {
  console.log(erore);
 };
};


exports.findCity = async (req, res) => {
 try {
  const data = await city.find({ "State": req.query.States }, { District: 1, _id: 0 });
  let arr = []
  for (const index of data) {
   arr.push(index.District);
  };
  return {
   statusCode: 200,
   status: true,
   message: "Find city Succesfully  ",
   data: arr
  };
 } catch (erore) {
  console.log(erore);
 };
};