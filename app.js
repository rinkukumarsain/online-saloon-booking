const express = require('express');
const app = express();
const cors = require("cors");

require('dotenv').config();
require('./src/datasources/connection');
const port = process.env.PORT;
const routes = require("./src/api");
const { urlencoded } = require('express');
app.use(cors());
app.use(express.json());
app.use(routes);
app.use(urlencoded({ extended: true }))

app.listen(port, () => {
    console.log(`server is running ${port}`)
});
