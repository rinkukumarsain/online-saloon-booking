const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
mongoose.connect(process.env.mongourl);
db = mongoose.connection;
db.on("error", console.log.bind(console, "connection error"));
db.once("open", function (callback) {
    console.log("connection succeeded");
});

module.exports = db