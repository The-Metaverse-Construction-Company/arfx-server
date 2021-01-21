"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateResetPasswordRoute = exports.verifyResetPasswordRoute = exports.sendResetPasswordRoute = exports.verifyResetPasswordMiddleWare = void 0;
const http_status_1 = __importDefault(require("http-status"));
const reset_password_1 = require("../service-configurations/reset-password");
const users_1 = require("../service-configurations/users");
const http_response_1 = require("../helper/http-response");
const constants_1 = require("../utils/constants");
exports.verifyResetPasswordMiddleWare = async (req, res, next) => {
    try {
        const { token = '', tokenType = '' } = req.query;
        const redisPublish = req.app.get('redisPublisher');
        const response = await users_1.userVerifyToken(redisPublish)
            .verifyOne(token, constants_1.TOKEN_TYPE.RESET_PASSWORD);
        res.locals.resetPasswordData = response;
        next();
    }
    catch (error) {
        return next(error);
    }
};
exports.sendResetPasswordRoute = async (req, res, next) => {
    try {
        const { email } = req.body;
        const redisPublish = req.app.get('redisPublisher');
        const response = await reset_password_1.sendResetPassword(redisPublish).resetOne(email);
        res.status(http_status_1.default.OK).json(http_response_1.successReponse(response));
    }
    catch (error) {
        return next(error);
    }
};
exports.verifyResetPasswordRoute = async (req, res, next) => {
    try {
        res.status(http_status_1.default.OK).json(http_response_1.successReponse(res.locals.resetPasswordData));
    }
    catch (error) {
        return next(error);
    }
};
exports.updateResetPasswordRoute = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { _id: userId } = res.locals.resetPasswordData;
        const redisPublish = req.app.get('redisPublisher');
        const response = await reset_password_1.updateResetPassword(redisPublish)
            .updateOne(userId, password);
        res.status(http_status_1.default.OK).json(http_response_1.successReponse(response));
    }
    catch (error) {
        return next(error);
    }
};
