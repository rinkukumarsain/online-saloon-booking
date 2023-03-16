const faqModel=require("./model")

exports.ADD_FREQUENT = async (req, res) => {
    const user = req.user
    res.render("add_frequent/add_frequent",{user})
}

exports.VIEW_FREQUENT = async (req, res) => {
    const data = await faqModel.find()
    const user = req.user
    res.render("add_frequent/view_frequent",{user,data})
}
exports.ADD_FREQUENT_DATA = async (req, res) => {
    res.locals.message=req.flash();
    const {answer,question} = req.query;
    console.log(answer);
    console.log(question.toString());
    console.log(answer,question)
    req.flash("success","Question's Answer update succesfully")
   const model = new faqModel({answer:answer,question:question});
   await model.save();
   console.log("hii");
   res.send();
   }

 