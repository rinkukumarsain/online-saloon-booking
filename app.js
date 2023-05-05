const express = require('express');
const app = express();
const cors = require("cors");
const path = require("path");
const flash = require("connect-flash");
const session = require("express-session");
const cookiparser = require("cookie-parser");
app.use(express.static(path.join(__dirname, '/public')));

app.set('views', path.join(__dirname, 'src/admin/views'));
app.set("view engine", "ejs");
app.use(cookiparser('keyboard cat'));
app.use(session({ cookie: { maxAge: 60000000 }, resave: true, saveUninitialized: true, secret: "secretsession" }));
app.use(flash());
app.use(cookiparser());
app.use(express.urlencoded({ extended: true }));
require('dotenv').config();
require('./src/datasources/connection');
const port = process.env.PORT;
const routes = require("./src/api");
const adminroutes = require("./src/admin");
app.use(cors());
app.use(express.json());
app.use(routes);
app.use(adminroutes);

app.listen(port, () => {
    console.log(`server is running ${port}`);
});