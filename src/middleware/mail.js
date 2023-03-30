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



exports.sendmailwarning = async ({ userData, body }) => {
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
            to: userData.email, // list of receivers
            subject: body.subject, // Subject line
            text: body.text
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