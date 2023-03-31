const user = require("../user/model");
const artist = require("./model");
const mongoose = require("mongoose");


exports.artistSignup = async ({ body, file }) => {
    try {
        let obj = {};
        const findUser = await user.findOne({ phone: body.phone });
        if (findUser) {
            const findArtist = await artist.findOne({ userId: findUser._id });
            if (findArtist) {
                return {
                    statusCode: 400,
                    status: false,
                    message: "your are allready register !",
                    data: [findArtist]
                };;
            };
            obj.userId = findUser._id;
        } else {
            const userDitail = new user({
                name: body.name,
                email: body.email,
                phone: body.phone,
                gender: body.gender,
                location: body.location,
            });
            const saveuser = await userDitail.save();
            if (saveuser) {
                obj.userId = saveuser._id
            };
        };

        if (body.skiils.length > 0) {
            obj.skiils = body.skiils;
        };

        const artistDitail = new artist(obj);
        const saveuser = await artistDitail.save();
        if (saveuser) {
            return {
                statusCode: 200,
                status: true,
                message: "artist registration successfully !",
                data: [saveuser]
            };
        };
    } catch (error) {
        console.log(error);
    };
};


