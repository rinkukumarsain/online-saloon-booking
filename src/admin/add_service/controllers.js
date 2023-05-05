const saloon = require("../../api/saloonstore/model");
const Category = require("../../api/category/model")
const saloonService = require("../../api/saloonService/model")
const mongoose = require("mongoose");
const service = require("./service")
const { getAllSaloonCity } = require("../../api/saloonstore/controller")

exports.ADD_SERVICE = async (req, res) => {
    try {
        res.locals.message = req.flash();
        const user = req.user
        const category = await Category.find({ parent_Name: null, type: 0 })
        let saloon_data;
        if (req.query.saloonId != undefined && req.query.saloonId != "") {
            saloon_data = await saloon.find({ _id: mongoose.Types.ObjectId(req.query.saloonId) })
        } else {
            saloon_data = await saloon.find()
        }
        const _id = req.query.id
        let pipeline = []
        pipeline.push({
            $match: {
                _id: mongoose.Types.ObjectId(_id)
            }
        }, {
            '$addFields': {
                'category': {
                    '$map': {
                        'input': '$category',
                        'as': 'elem',
                        'in': {
                            '$toString': '$$elem'
                        }
                    }
                }
            }
        }
        )
        const service_data = (await saloonService.aggregate(pipeline))[0]
        res.render("add_service/add_service", { user, category, saloon_data, service_data })
    } catch (err) {
        console.log(err)
    }
}



exports.optiongeturl = async (req, res) => {
    try {
        const parent_id = req.query.select
        if (parent_id != undefined && parent_id.length == 24) {
            const _id = mongoose.Types.ObjectId(parent_id)

            const sub_category = await Category.find({ parent_Name: _id })
            const userdata = []
            sub_category.forEach((index) => {
                userdata.push({
                    "_id": index._id,
                    "Name": index.Name,
                    "parent_Name": index.parent_Name,
                });
            });
            res.send(userdata);

        }
    } catch (error) {
        console.log(error)
    }
}

exports.ADD_SERVICE_STORE = async (req, res) => {
    try {
        let { body, files, query } = req;
        res.locals.message = req.flash();
        if (query.id) {
            let _id = mongoose.Types.ObjectId(query.id);
            const result = await saloonService.findOne({ _id });
            if (result) {
                let obj = {};
                if (body.ServiceName) { obj.ServiceName = body.ServiceName };
                if (body.ServicePrice) { obj.ServicePrice = body.ServicePrice };
                if (body.timePeriod_in_minits) { obj.timePeriod_in_minits = body.timePeriod_in_minits };
                if (body.type) { obj.type = body.type };
                if (body.description) { obj.description = body.description };
                if (body.category) { obj.category = body.category };
                if (body.saloonStore) { obj.saloonStore = mongoose.Types.ObjectId(body.saloonStore) };
                if (body.last_category) { obj.last_category = mongoose.Types.ObjectId(body.last_category) };
                if (files.length > 0) {
                    img = []
                    files.forEach(element => {
                        img.push(element.filename)
                    });
                    obj.image = img
                };
                const result = await saloonService.findByIdAndUpdate({ _id }, { $set: obj }, { new: true });
                if (result) {
                    req.flash("success", "Saloon Service  is  Update successfull !");
                    return res.redirect("/view_service");
                };

            } else {
                req.flash("error", "Saloon Service is Not Found !");
                return res.redirect("/");
            };
        } else {
            const { ServiceName } = body;
            if (ServiceName) {
                const result = await saloonService.find({ ServiceName, saloonStore: mongoose.Types.ObjectId(body.saloonStore) });
                for (const item of result) {
                    if (item.ServicePrice == Number(body.ServicePrice)) {
                        if (item.timePeriod_in_minits == Number(body.timePeriod_in_minits)) {
                            if (item.type != body.type || body.type == "unisex") {
                                body.type = "unisex";
                            } else {
                                req.flash("error", "Service gender type allready  Exists");
                                return res.redirect("/add_service");
                            };
                            const result2 = await saloonService.findByIdAndUpdate({ _id: item._id }, { type: body.type }, { new: true });
                            if (result2) {
                                req.flash("success", "Service update Succesfuuly ! 1");
                                return res.redirect("/view_service");
                            };
                        };
                    };
                };
            };

            if (files) {
                img = []
                files.forEach(element => {
                    img.push(element.filename)
                });
                body.image = img
            } else {
                body.image = ""
            };
            let last_category = body.category[body.category.length - 1];
            let service_details = new saloonService({
                ServiceName: body.ServiceName,
                ServicePrice: body.ServicePrice,
                timePeriod_in_minits: body.timePeriod_in_minits,
                type: body.type,
                description: body.description,
                image: body.image,
                category: body.category,
                saloonStore: mongoose.Types.ObjectId(body.saloonStore),
                last_category: mongoose.Types.ObjectId(last_category)
            });
            const result = await service_details.save();
            if (result) {
                req.flash("success", "Service Add Succesfuuly !")
                return res.redirect("/view_service")
            };
        };
    } catch (error) {
        console.log(error);
    };
};

exports.VIEW_SERVICE = async (req, res) => {
    try {
        res.locals.message = req.flash();
        const data = await service.VIEW_SALOON(req)
        const user = req.user
        return res.render("add_service/view_service", { query: req.query, user, data })
    } catch (error) {
        console.log(error);
    }
}

exports.DELETE_SERVICE = async (req, res) => {
    const id = req.query.id
    await saloonService.findByIdAndDelete({ _id: id })
    res.redirect("/view_service")
}

exports.FindAllServiceName = async (req) => {
    let arr = []
    const findData = await saloonService.find()

    for (const item of findData) {
        if (item.ServiceName != "" && item.ServiceName != undefined) {
            if (arr.includes(item.ServiceName) == false) {
                arr.push(item.ServiceName)
            }
        }
    }

    if (arr.length > 0) {
        return arr;
    }

}
exports.findSallon = async (req, res) => {
    try {
        const data = await saloon.findOne({ _id: mongoose.Types.ObjectId(req.query.id) }, { type: 1, storeName: 1 })
        res.send(data)
    } catch (error) {
        console.log(error)
    }
}