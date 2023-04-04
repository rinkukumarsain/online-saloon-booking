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
        default: ""
    },
    ownerName: {
        type: String,
        default: ""
    },
    password: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        default: ""
    },
    Phone: {
        type: Number,
        default: ""
    },
    // image: {
    //     type: [String],
    // },
    location: {
        // shopNumber: {
        //     type: Number
        // },
        aria: {
            type: String,
            default: ""
        },
        pincode: {
            type: String,
            default: ""
        },
        city: {
            type: String,
            default: ""
        },
        state: {
            type: String,
            default: ""
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
        type: String,
        default: "1"
    },
    description: {
        type: String,
    },
    ProfileInfo: {
        yourService: {
            type: String,
            default: ""
        },
        alternatePhone: {
            type: String,
            default: ""
        },
        starting_time: {
            type: String,
            default: ""
        },
        ending_time: {
            type: String,
            default: ""
        },
        workingday: {
            type: [String],
            default: ""
        },
        FaceBookProfile: {
            type: String,
            default: ""
        },
        instaProfile: {
            type: String,
            default: ""
        },
        webProfile: {
            type: String,
            default: ""
        },
        amenities: {
            type: [String],
            default: ""
        },
    },
    BankInfo: {
        panNo: {
            type: String,
            default: ""
        },
        gstNo: {
            type: String,
            default: ""
        },
        bankName: {
            type: String,
            default: ""
        },
        branchName: {
            type: String,
            default: ""
        },
        accountNo: {
            type: String,
            default: ""
        },
        accoutHolder: {
            type: String,
            default: ""
        },
        ifscCode: {
            type: String,
            default: ""
        },
        kyc: {
            type: String,
            default: ""
        },
    },
    uplodeDocuments: {
        BannerLogo: {
            type: String,
            default: ""
        },
        logoImage: {
            type: String,
            default: ""
        },
        panImage: {
            type: String,
            default: ""
        },
        businessCertificate: {
            type: String,
            default: ""
        },
    }
}, { timestamps: true });


const saloonRequst = new mongoose.model("saloonRequst", saloon_Requst);
module.exports = saloonRequst;


