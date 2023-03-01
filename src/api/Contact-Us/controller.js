const Contact = require("./model");
const { sendmail } = require("../../middleware/mail")

exports.ContactUs = async ({ user, body }) => {
    try {
        if (body.phone != undefined && body.phone != "") {
            const phone = body.phone;
            const findData = await Contact.findOne({ phone });
            if (findData != null) {
                return {
                    statusCode: 400,
                    status: false,
                    message: "Your contact requist allready panding !",
                    data: []

                };
            };
        };

        if (body.email != undefined && body.email != "") {
            const email = body.email;
            const findData = await Contact.findOne({ email });
            if (findData != null) {
                return {
                    statusCode: 400,
                    status: false,
                    message: "Your contact requist allready panding !",
                    data: []

                };
            };
        };

        if (body.phone != undefined && body.phone == user.phone && body.email != undefined && user.email == body.email) {
            const contactDtails = new Contact(body);
            const result = await contactDtails.save();
            if (result) {
                const sendmailer = await sendmail(result)
                if (sendmailer) {
                    console.log("sendmailer", 2, sendmailer)
                    return {
                        statusCode: 200,
                        status: true,
                        message: "ContactUs successfull !",
                        data: [result]
                    };
                }

            };
        };
    } catch (error) {
        console.log(error);
        throw error;
    };
};
