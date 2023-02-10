const { default: mongoose } = require("mongoose")

module.exports = controllerFunction => async (request, response, next) => {
    try {
        const { statusCode, ...resObj } = await controllerFunction(request, response, next)
        response.status(+statusCode).json(resObj)
        // console.log(`${request.method.padEnd(6, " ")} => ${request.url} - ${new Date().getTime() - request.date.getTime()} ms`)
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            response.status(400).json({
                status: false,
                message: "Wrong ID Format",
                data: []
            })
        } else {
            console.log(error)
            response.status(500).json({
                status: false,
                message: "Internal server error!",
                data: []
            })
        }
    }
}