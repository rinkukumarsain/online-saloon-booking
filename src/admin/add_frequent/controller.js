const faqModel = require("./model")
const mongoose = require("mongoose")

exports.ADD_FREQUENT = async (req, res) => {
    try {
        const user = req.user;
        const _id = req.query.id;
        const faqData = await faqModel.findOne({ _id });
        res.render("add_frequent/add_frequent", { user, faqData });
    } catch (err) {
        console.log(err);
    };
};

exports.DELETE_FREQUENT = async (req, res) => {
    try {
        const id = req.query.id;
        const data = await faqModel.findByIdAndDelete({ _id: id });
        res.redirect("/view_frequent");
    } catch (err) {
        console.log(err);
    };
};

exports.VIEW_FREQUENT = async (req, res) => {
    try {
        const data = await faqModel.find();
        const user = req.user;
        res.render("add_frequent/view_frequent", { user, data });
    } catch (err) {
        console.log(err);
    };
}
exports.ADD_FREQUENT_DATA = async (req, res) => {
    try {
        res.locals.message = req.flash();
        const { answer, question } = req.body;
        if (req.body.faqData) {
            req.flash("success", "Question's Answer update succesfully");
            const faqData = req.body.faqData;
            const model = await faqModel.findByIdAndUpdate({ _id: faqData }, { answer: answer, question: question });
            res.send();
        } else {
            req.flash("success", "Question's Answer update succesfully");
            const model = new faqModel({ answer: answer, question: question });
            await model.save();
            res.send();
        }
    } catch (err) {
        console.log(err);
    };
};

exports.ViwesFindQustion = async (req, res) => {
    try {
        const data = await faqModel.find({ _id: mongoose.Types.ObjectId(req.query.id) });
        res.send(data);
    } catch (err) {
        console.log(err);
    };
};

