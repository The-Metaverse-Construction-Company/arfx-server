"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyTokenRoute = exports.verifyUserRoute = exports.signUpRoute = exports.verifyTokenMiddleware = void 0;
const http_status_1 = __importDefault(require("http-status"));
const sign_up_1 = require("../service-configurations/sign-up");
const index_1 = require("../domain/entities/users/index");
const http_response_1 = require("../helper/http-response");
/**
 * Returns jwt token if registration was successful
 * @public
 */
exports.verifyTokenMiddleware = async (req, res, next) => {
    try {
        let redisPublisher = req.app.get('redisPublisher');
        const { token = '' } = req.query;
        const newUser = await sign_up_1.verifySignUpToken(redisPublisher)
            .verifyOne(token);
        res.locals.signUpVerifiedTokenResponse = newUser;
        next();
    }
    catch (error) {
        next(error);
    }
};
/**
 * Returns jwt token if registration was successful
 * @public
 */
exports.signUpRoute = async (req, res, next) => {
    try {
        let redisPublisher = req.app.get('redisPublisher');
        const newUser = await sign_up_1.userSignUp(redisPublisher)
            .createOne({
            ...req.body,
            role: index_1.ALLOWED_USER_ROLE.USER
        });
        //@ts-ignore
        delete newUser.password;
        res.status(http_status_1.default.CREATED).json(http_response_1.successReponse(newUser));
    }
    catch (error) {
        next(error);
    }
};
/**
 * Returns jwt token if registration was successful
 * @public
 */
exports.verifyUserRoute = async (req, res, next) => {
    try {
        let redisPublisher = req.app.get('redisPublisher');
        const { _id: userId } = res.locals.signUpVerifiedTokenResponse;
        const newUser = await sign_up_1.verifyUser(redisPublisher)
            .updateOne(userId);
        //@ts-ignore
        delete newUser.password;
        res.status(http_status_1.default.OK).json(http_response_1.successReponse(newUser));
    }
    catch (error) {
        next(error);
    }
};
/**
 * Returns jwt token if registration was successful
 * @public
 */
exports.verifyTokenRoute = async (req, res, next) => {
    try {
        res.status(http_status_1.default.OK).json(http_response_1.successReponse(res.locals.signUpVerifiedTokenResponse));
    }
    catch (error) {
        next(error);
    }
};
