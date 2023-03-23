const { string } = require("joi");
const mongoose = require("mongoose");

var ObjectId = require('mongodb').ObjectId;

const saloon_Requst = new mongoose.Schema({
    userId: {
        type: ObjectId,
        default: null
    },
    storeName: {
        type: String,
    },
    ownerName: {
        type: String,
    },
    password: {
        type: String,
    },
    email: {
        type: String,
    },
    Phone: {
        type: Number
    },
    // image: {
    //     type: [String],
    // },
    location: {
        // shopNumber: {
        //     type: Number
        // },
        aria: {
            type: String
        },
        pincode: {
            type: String
        },
        city: {
            type: String
        },
        state: {
            type: String
        },

    },
    category: {
        type: [String]
    },
    type: {
        type: String,
        default: "Unisex"
    },
    status: {
        type: String,
        default: "pending"
    },
    Partner_Size: {
        type: String
    },
    ProfileInfo: {
        yourService: {
            type: String
        },
        alternatePhone: {
            type: String
        },
        starting_time: {
            type: String
        },
        ending_time: {
            type: String
        },
        workingday: {
            type: [String]
        },
        FaceBookProfile: {
            type: String
        },
        instaProfile: {
            type: String
        },
        webProfile: {
            type: String
        },
        amenities: {
            type: [String]
        },
    },
    BankInfo: {
        panNo: {
            type: String
        },
        gstNo: {
            type: String
        },
        bankName: {
            type: String
        },
        branchName: {
            type: String
        },
        accountNo: {
            type: String
        },
        accoutHolder: {
            type: String
        },
        ifscCode: {
            type: String
        },
        kyc: {
            type: String
        },
    },
    uplodeDocuments: {
        BannerLogo: {
            type: String
        },
        logoImage: {
            type: String
        },
        panImage: {
            type: String
        },
        businessCertificate: {
            type: String
        },
    }
}, { timestamps: true });


const saloonRequst = new mongoose.model("saloonRequst", saloon_Requst);
module.exports = saloonRequst;


