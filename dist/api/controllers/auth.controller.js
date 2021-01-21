"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refresh = exports.oAuth = exports.userSignOutRoute = exports.login = void 0;
const http_status_1 = __importDefault(require("http-status"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const sign_in_1 = require("../service-configurations/sign-in");
const users_1 = require("../service-configurations/users");
const user_model_1 = __importDefault(require("../models/user.model"));
const http_response_1 = require("../helper/http-response");
const constants_1 = require("../utils/constants");
const RefreshToken = require('../models/refreshToken.model');
const { jwtExpirationInterval } = require('../../config/vars');
/**
 * Returns a formated object with tokens
 * @private
 */
function generateTokenResponse(user, accessToken) {
    const tokenType = 'Bearer';
    const refreshToken = RefreshToken.generate(user).token;
    const expiresIn = moment_timezone_1.default().add(jwtExpirationInterval, 'minutes');
    return {
        tokenType,
        accessToken,
        refreshToken,
        expiresIn,
    };
}
/**
 * Returns jwt token if valid username and password is provided
 * @public
 */
exports.login = async (req, res, next) => {
    try {
        const { username = '', password = '', } = req.body;
        let redisPublisher = req.app.get('redisPublisher');
        const response = await sign_in_1.userSignIn(redisPublisher)
            .signIn({
            username: username.trim(),
            password: password.trim()
        });
        // const { user, accessToken } = await User.findAndGenerateToken(req.body);
        // const token = generateTokenResponse(user, accessToken);
        // const userTransformed = user.transform();
        res.status(http_status_1.default.OK).send(http_response_1.successReponse(response));
    }
    catch (error) {
        return next(error);
    }
};
/**
 * Returns jwt token if valid username and password is provided
 * @public
 */
exports.userSignOutRoute = async (req, res, next) => {
    try {
        const { authorization = '' } = req.headers;
        const accessToken = authorization.split(' ')[1];
        let redisPublisher = req.app.get('redisPublisher');
        const user = await users_1.verifyUserToken(redisPublisher)
            .verifyOne(accessToken, constants_1.TOKEN_TYPE.SIGN_IN)
            .catch(() => null);
        if (!user) {
            res.status(http_status_1.default.OK).send(http_response_1.successReponse(false));
            return;
        }
        const response = await sign_in_1.userSignOut(redisPublisher)
            .signOut(user._id);
        res.status(http_status_1.default.OK).send(http_response_1.successReponse(response));
    }
    catch (error) {
        return next(error);
    }
};
/**
 * login with an existing user or creates a new one if valid accessToken token
 * Returns jwt token
 * @public
 */
exports.oAuth = async (req, res, next) => {
    try {
        const { user } = req;
        //@ts-expect-error
        const accessToken = user.token();
        const token = generateTokenResponse(user, accessToken);
        //@ts-expect-error
        const userTransformed = user.transform();
        return res.json({ token, user: userTransformed });
    }
    catch (error) {
        return next(error);
    }
};
/**
 * Returns a new jwt when given a valid refresh token
 * @public
 */
exports.refresh = async (req, res, next) => {
    try {
        const { email, refreshToken } = req.body;
        const refreshObject = await RefreshToken.findOneAndRemove({
            userEmail: email,
            token: refreshToken,
        });
        //@ts-expect-error
        const { user, accessToken } = await user_model_1.default.findAndGenerateToken({ email, refreshObject });
        const response = generateTokenResponse(user, accessToken);
        return res.json(response);
    }
    catch (error) {
        return next(error);
    }
};
