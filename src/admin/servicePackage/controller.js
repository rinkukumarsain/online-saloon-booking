const mongoose = require("mongoose");
const { getAllSaloonCity } = require("../../api/saloonstore/controller");
const { getCategoryListing } = require("../../api/category/controller")
const saloonService = require("../../api/saloonService/model")
const package = require("./model")

exports.package = async (req, res) => {
    try {
        req.query.type = 1
        let iid = req.query.id
        req.query.id = ""
        console.log("package", req.query)
        const FindCategory = await getCategoryListing(req)

        if (iid != undefined && iid != "") {
            console.log("idd", iid)
            const data = await package.findOne({ _id: mongoose.Types.ObjectId(iid) });
            if (data) {
                res.render("servicePackage/index", { user: req.user, data, Category: FindCategory.data, query: req.query });
            }
        } else {
            res.render("servicePackage/index", { user: req.user, data: "", Category: FindCategory.data, query: req.query });
        };
    } catch (error) {
        console.log(error);
    };
};




exports.FindServiceForPackages = async (req, res) => {
    try {
        // console.log("FindServiceForPackages", req.query)
        const FindService = await saloonService.find({ saloonStore: mongoose.Types.ObjectId(req.query.saloonId), type: { $in: ['unisex', req.query.type] } })
        // console.log(FindService.length)
        // f
        res.send(FindService)
    } catch (error) {
        console.log(error);
    };
};

exports.CreatePackage = async (req, res) => {
    try {res.locals.message = req.flash();
        console.log("CreatePackage", req.query, "body", req.body)
        // console.log("req.body.Services", req.body.Services)
        let arr = [];

         for (const item of req.body.Services) {
            //console.log(" kjlkjljlllk",item)
            //if(item)
            //{//let data=item
            
            let data = JSON.parse(item)
            
            arr.push(data.id)
            
        }
        let info=await package.findOne({ PackageCotegory:req.body.PackageCotegory,salonnId:req.query.saloonId})
        if(!info)
        {
        console.log("arr",arr)
        req.body.Services = arr
        req.body.saloonId = req.query.saloonId
        const pakegeDetail = new package(req.body)
        const result = await pakegeDetail.save()
        }
        else
        {req.body.Services = arr
            req.body.saloonId = req.query.saloonId
            
            let pakegeDetail=await package.updateMany(
            { PackageCotegory:req.body.PackageCotegory,salonnId:req.query.saloonId} ,
             req.body,{new:true} 
         );

        }
        // console.log("result", result)
        req.flash("success","package edit successfully")
        res.redirect("/")
        // const FindService = await saloonService.find({ saloonStore: mongoose.Types.ObjectId(req.query.saloonId), type: { $in: ['unisex', req.query.type] } })
        // // console.log(FindService.length)
        // // f
        // res.send(FindService)
    } catch (error) {
        console.log(error);
    };
};

exports.viewServicePackage = async (req, res) => {
    try {
        res.locals.message = req.flash();
        const data = await package.aggregate([
            {
                '$lookup': {
                    'from': 'saloons',
                    'localField': 'saloonId',
                    'foreignField': '_id',
                    'pipeline': [
                        {
                            '$project': {
                                'storeName': 1
                            }
                        }
                    ],
                    'as': 'saloonNmae'
                }
            }
        ]);
        res.render("servicePackage/view_service_Package", { query: req.query, user: req.user, data });
    } catch (error) {
        console.log(error);
    };
};
//sahil view package
exports.viewServicePackageparticular=async (req, res) => {
    try {
        res.locals.message = req.flash();
        const data = await package.aggregate([ {
            '$match': {
              'saloonId': mongoose.Types.ObjectId(req.query.id)
            }
          },
            {
                '$lookup': {
                    'from': 'saloons',
                    'localField': 'saloonId',
                    'foreignField': '_id',
                    'pipeline': [
                        {
                            '$project': {
                                'storeName': 1
                            }
                        }
                    ],
                    'as': 'saloonNmae'
                }
            }
        ]);
        console.log("data",data)

        res.render("servicePackage/viewServicePackageparticular", { query: req.query, user: req.user, data });
    } catch (error) {
        console.log(error);
    };
}; 
//sahil view package end
exports.deletePackage = async (req, res) => {
    try {

        if (req.query.id != undefined && req.query.id != "") {
            const updateData = await package.findByIdAndDelete({ _id: mongoose.Types.ObjectId(req.query.id) })
            if (updateData) {
                res.redirect("/view-service-Package");
            };
        } else {
            res.redirect("/");
        }
    } catch (error) {
        console.log(error);
    };
};


exports.FindPackageService = async (req, res) => {
    try {
        const data = await package.aggregate(
            [{
                '$match': {
                    _id: mongoose.Types.ObjectId(req.query.id)
                }
            },
            {
                '$lookup': {
                    'from': 'saloons',
                    'localField': 'saloonId',
                    'foreignField': '_id',
                    'as': 'saloon'
                }
            }, {
                '$lookup': {
                    'from': 'saloonservices',
                    'localField': 'Services',
                    'foreignField': '_id',
                    'as': 'Service'
                }
            }
            ])
        console.log("data", data)
        res.send(data)
    } catch (error) {
        console.log(error);
    };
};
/*
exports.ViewAllCoupon = async (req, res) => {
    try {
        let serchobj = {};
        let searchobj = {};
        if (req.query.amount) {
            searchobj.Amount = req.query.amount;
            serchobj.Amount = { $gte: req.query.amount };
        }
        if (req.query.title) {
            searchobj.Title = req.query.title;
            serchobj.Title = { $regex: req.query.title, $options: "i" };
        }
        if (req.query.coupon) {
            searchobj.CouponCode = req.query.coupon
            serchobj.CouponCode = { $regex: req.query.coupon, $options: "i" };
        }
        if (req.query.enddate) {
            searchobj.EndDate = req.query.enddate;
            serchobj.EndDate = req.query.enddate
        }
        if (req.query.startdate) {
            searchobj.StartDate = req.query.startdate
            serchobj.StartDate = req.query.startdate
        }
        const updateData = await coupon.find(serchobj);
        res.render("Coupon/view-View-Coupon", { user: req.user, data: updateData, filter: req.query, searchobj });
    } catch (error) {
        console.log(error);
    };
};



*/
