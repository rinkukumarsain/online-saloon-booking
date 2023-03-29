const nodemailer = require("nodemailer");

exports.sendmail = async (user) => {
    try {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.email, // generated ethereal user
                pass: process.env.pass, // generated ethereal password
            }
        });
        var mailoption = {
            from: process.env.email, // sender address
            to: "sahilagarwal.img@gmail.com", // list of receivers
            subject: `${user.services} ✔`, // Subject line
            text: `hello my name is ${user.name} 
        And my Email is ${user.email} And phone:-${user.phone}
        my Services is ${user.services}
        massege :-${user.message}
        Thanks & Regards
        ${user.name}`
        };
        let result = await transporter.sendMail(mailoption)
        if (result) {
            return {
                statusCode: 200,
                status: true,
                message: "ContactUs successfull !",
                data: [result]
            };
        };

    } catch (error) {
        console.log(error);

    };
};



exports.sendmailwarning = async (req) => {
    try {
        console.log("req.body", req.body)
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.email, // generated ethereal user
                pass: process.env.pass, // generated ethereal password
            }
        });
        console.log("----",2)
        var mailoption = {
            from: process.env.email, // sender address
            to: req.body.email, // list of receivers
            subject: req.body.subject, // Subject line
            text: req.body.text
        };
        console.log("----",3)
        let result = await transporter.sendMail(mailoption)
        console.log("----",result,4)
        if (result) {
            return {
                statusCode: 200,
                status: true,
                message: "ContactUs successfull !",
                data: [result]
            };
        };

    } catch (error) {
        console.log(error);

    };
};