const faqModel=require("./model")

exports.ADD_FREQUENT = async (req, res) => {

    const user = req.user
    const _id = req.query.id
    const faqData = await faqModel.findOne({ _id })
    
    res.render("add_frequent/add_frequent",{user,faqData})
}
exports.DELETE_FREQUENT= async (req, res) => {
    const id=req.query.id;
    
    const data = await faqModel.findByIdAndDelete({_id:id})
   
    res.redirect("/view_frequent")
}

exports.VIEW_FREQUENT = async (req, res) => {
    const data = await faqModel.find()
    const user = req.user
    res.render("add_frequent/view_frequent",{user,data})
}
exports.ADD_FREQUENT_DATA = async (req, res) => {
    res.locals.message=req.flash();
    //const {answer,question} = req.query;
    const {answer,question}=req.body;
    //console.log(req.body)
    //answer=answer.slice(1,answer.length-1)
    //question=question.slice(1,question.length-1)
    // console.log("ans",ans,"que",que)
    // console.log(answer);
    // // console.log(question.toString());
    if(req.body.faqData)
     {req.flash("success","Question's Answer update succesfully")
     console.log("faqData",req.body.faqData)
     console.log("hiinbkbkvhv")
        const faqData=req.body.faqData;
        const model=await faqModel.findByIdAndUpdate({_id:faqData},{answer:answer,question:question});
        res.send();
     }
     else{
    req.flash("success","Question's Answer update succesfully")
   const model = new faqModel({answer:answer,question:question});
   await model.save();
   console.log("hii");
   res.send();}
   }

 