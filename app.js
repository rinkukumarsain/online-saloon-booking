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


/*
+919928738737
+917728060715
+918905145453
+917023581581
+918962177611
+917611861680
+919828166657
+917087660958
+919501978494
+918976377085
+919610008896
+919571435212
+917821845299
+918562087096
+919829055386
// Phone Number img group 
+917240371026
+919694064989
+919782870390
+918955512533
+919602354397
+919694089702
+919460084414
+916367081279
*/
