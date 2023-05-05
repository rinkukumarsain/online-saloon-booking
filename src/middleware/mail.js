const nodemailer = require("nodemailer");

exports.sendmail = async (user) => {
    try {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.email,
                pass: process.env.pass,
            }
        });
        var mailoption = {
            from: process.env.email,
            to: "sahilagarwal.img@gmail.com",
            subject: `${user.services} ✔`,
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
                user: process.env.email,
                pass: process.env.pass,
            }
        });
        var mailoption = {
            from: process.env.email,
            to: userData.email,
            subject: body.subject,
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

exports.newLetterEmail = async ({ body, arr }) => {
    try {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.email,
                pass: process.env.pass,
            }
        });

        var mailoption = {
            from: process.env.email,
            to: arr,
            subject: "body.subject",
            text: body.description
        };

        let result = await transporter.sendMail(mailoption);
        if (result) {
            return {
                statusCode: 200,
                status: true,
                message: "mails send  successfull !",
                data: []
            };
        };
        return {
            statusCode: 200,
            status: true,
            message: "mails send  successfull !",
            data: []
        };
    } catch (error) {
        console.log(error);
    };
};