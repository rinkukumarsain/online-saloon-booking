exports.ADD_FREQUENT = async (req, res) => {
    const user = req.user
    res.render("add_frequent/add_frequent",{user})
}