const user = require("../../api/user/model");

exports.allUser = async (req, res) => {
    try {
        const Finddata = await user.find();

        console.log("Finddata", Finddata)
        return {
            statusCode: 200,
            status: true,
            message: "address-is already in database !",
            data: Finddata
        };
    } catch (error) {
        console.log(error);
    };
};


