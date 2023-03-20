
const joi = require("joi")

exports.joi_createCoupon = (req, res, next) => {
    const shecme = joi.object().keys({
        Titel: joi.string().required(),
        Amount: joi.number().required(),
        CouponCode: joi.string().required(),
        StartDate: joi.date().required(),
        EndDate: joi.date().required(),
        Limit: joi.string().required(),
        Discount: joi.number().required(),
        id: joi.optional(),
    })//.unknown(true)

    const { error } = shecme.validate(req.body, { abortEarly: false });

    if (error) { res.send({ error: error.details }) }
    else { next(); };
}

exports.joi_EditCoupon = (req, res, next) => {
    const shecme = joi.object().keys({
        Titel: joi.string().optional(),
        Amount: joi.number().optional(),
        CouponCode: joi.string().optional(),
        StartDate: joi.date().optional(),
        EndDate: joi.date().optional(),
        Limit: joi.string().optional(),
        Discount: joi.number().optional(),
    })//.unknown(true)

    const { error } = shecme.validate(req.body, { abortEarly: false });

    if (error) { res.send({ error: error.details }) }
    else { next(); };
}



