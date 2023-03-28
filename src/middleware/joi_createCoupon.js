
const JOI = require("joi")

exports.joi_createCoupon = (req, res, next) => {
    const scheme = JOI.object().keys({
        Title: JOI.string().required(),
        Amount: JOI.number().required(),
        CouponCode: JOI.string().required(),
        StartDate: JOI.date().required(),
        EndDate: JOI.date().required(),
        Limit: JOI.string().required(),
        Discount: JOI.number().required(),
        id: JOI.optional(),
    })//.unknown(true)

    const { error } = scheme.validate(req.body, { abortEarly: false });

    if (error) { res.send({ error: error.details }) }
    else { next(); };
}

exports.joi_EditCoupon = (req, res, next) => {
    const scheme = JOI.object().keys({
        Title: JOI.string().optional(),
        Amount: JOI.number().optional(),
        CouponCode: JOI.string().optional(),
        StartDate: JOI.date().optional(),
        EndDate: JOI.date().optional(),
        Limit: JOI.string().optional(),
        Discount: JOI.number().optional(),
    })//.unknown(true)

    const { error } = scheme.validate(req.body, { abortEarly: false });

    if (error) { res.send({ error: error.details }) }
    else { next(); };
}



