const user = require("../../api/user/model");

exports.allUser = async (req, res) => {
    try {
        const Finddata = await user.find();

        console.log("Finddata", Finddata)
        return {
            statusCode: 200,
            status: true,
            message: "address-is allready in data base  !",
            data: Finddata
        };
    } catch (error) {
        console.log(error);
    };
};


