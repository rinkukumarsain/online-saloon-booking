const nodemailer = require("nodemailer");

exports.sendmail = async (user) => {
    // console.log("user,,,,,", user)
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.email, // generated ethereal user
            pass: process.env.pass, // generated ethereal password
        }
    });
    var mailoption = {
        from: process.env.email, // sender address
        to: "rahbar.img@gmail.com", // list of receivers
        subject: `${user.services} ✔`, // Subject line
        text: `hello my name is ${user.name} 
        And my Email is ${user.email} And phone:-${user.phone}
        my Services is ${user.services}
        massege :-${user.message}
        Thanks & Regards
        ${user.name}`
    }
    let result = await transporter.sendMail(mailoption)
    // console.log("result", result)
    if (result) {
        console.log("send")
        return {
            details: result
        }
    }
    /*, async function (error, info) {
        if (error) {
            console.log(error)
        } else {
            return {
                details: info.response
            }
        }
    })*/
}