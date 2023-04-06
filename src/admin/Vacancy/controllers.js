const category = require("../../api/category/model");
const artist = require("../../api/artist/model");
const mongoose = require("mongoose")
const service = require("./services")
const { getCategoryListing } = require("../../api/category/controller")
const { FindAllServiceName } = require("../add_service/controllers")
const seloonservice = require("../../api/saloonService/model")

exports.Vacancy = async (req, res) => {
    try {
        let data;
        const category_data = await getCategoryListing(req)
        const services = await FindAllServiceName(req)
        // console.log("category_data", category_data)
        res.render("vacancy/index", { user: req.user, data, category_data: category_data.data, services })
    } catch (error) {
        console.log(error)
    }

}

exports.FindserviceforAdmin = async (req, res) => {
    try {
        const data = await seloonservice.find({ category: { $in: mongoose.Types.ObjectId(req.query.id) } })
        res.send(data)
    } catch (error) {
        console.log(error)
    }
}

exports.addVacency = async (req, res) => {
    try {
        const condition = []
        const obj = {};
        if (req.query.id != undefined && req.query.id != "") {
            condition.push({
                '$match': {
                    '_id': mongoose.Types.ObjectId(req.query.id)
                }
            })
        }
        condition.push({
            '$lookup': {
                'from': 'users',
                'localField': 'userId',
                'foreignField': '_id',
                'as': 'user'
            }
        })
        condition.push({
            '$unwind': {
                'path': '$user'
            }
        });
        if (req.query.city != undefined && req.query.city != "") {
            obj['user.location.city'] = req.query.city
        }

        if (req.query.phone != undefined && req.query.phone != "") {
            obj['user.phone'] = Number(req.query.phone)
        }
        if (req.query.email != undefined && req.query.email != "") {
            obj['user.email'] = { $regex: req.query.email, $options: 'i' }
        }
        if (req.query.type != undefined && req.query.type != "") {
            obj['user.type'] = { $regex: req.query.type, $options: 'i' }
        }
        condition.push({
            '$match': obj
        })
        const allcity = await this.getArtistsCity(req)
        const data = await artist.aggregate(condition)
        if (req.query.id != undefined && req.query.id != "") {
            res.send(data);
        } else {
            const _id = req.query.id
            const user = req.user
            res.render("Artists/index", { allcity, user, data, _id, query: req.query, })
        }
    } catch (e) {
        console.log(e)
    }
}
/*



exports.getArtistsCity = async (req) => {
    try {
        let arrrCity = []
        let condition = []
        condition.push({
            '$lookup': {
                'from': 'users',
                'localField': 'userId',
                'foreignField': '_id',
                'as': 'user'
            }
        })
        condition.push({
            '$unwind': {
                'path': '$user'
            }
        });

        const data = await artist.aggregate(condition);
        data.forEach(element => {
            if (arrrCity.includes(element.user.location?.city) == false && element.user.location?.city != undefined && element.user.location?.city != "") {
                arrrCity.push(element.user.location?.city)
            }
        });
        return arrrCity;
    } catch (e) {
        console.log(e);
    };
};

*/
