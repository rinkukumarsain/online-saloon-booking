const { Router } = require("express");
const responseHandler = require("../../utils/responseHandlers")
const { getCategoryListing, getAllCategoryListing } = require('./controller');
const app = Router();

const categoryModule = require("./model")

app.get("/getCategoryListing/:id?", responseHandler(getCategoryListing))
// app.get("/getAllCategoryListing", responseHandler(getAllCategoryListing))


/*
app.get("/getAllCategoryListing", async (req, res) => {

    async function getDinamicCategory(idd) {
        let arrr = []
        let condition = {}
        if (idd) {
            condition = { _id: req.query.id };
        } else {
            condition = { parent_Name: null };
        }
        const FindData = await categoryModule.find(condition)
        // if (FindData.length > 0) {
        for (const catogiry of FindData) {
            const subcatogy = await categoryModule.find({ parent_Name: catogiry._id })
            if (FindData.length > 0) {
                idd = catogiry._id
                catogiry._doc.subcatory = subcatogy
                arrr.push(catogiry)
                console.log("catogiry...", catogiry)
                getDinamicCategory(idd)
            } else {
                console.log("-----------------------------------------------------------else")
                return arrr;
            }
        }

    }
    const catogiry = await getDinamicCategory()
    res.send(catogiry)

})
*/
module.exports = app