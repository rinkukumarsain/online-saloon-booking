const { Router } = require("express");
const responseHandler = require("../../utils/responseHandlers")
const auth = require("../../middleware/auth")
const { addUserAddress, getUserAddress } = require('./controller');
const app = Router();

module.exports = app