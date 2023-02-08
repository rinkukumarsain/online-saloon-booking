const express = require('express');
const app = express();
require('dotenv').config();
require('./src/datasources/connection');
const port = process.env.PORT;
const routes = require("./src/api")
app.use(express.json());
app.use(routes);

app.listen(port, () => {
    console.log(`server is running ${port}`)
});
