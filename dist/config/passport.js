"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.google = exports.facebook = exports.jwt = void 0;
const passport_jwt_1 = require("passport-jwt");
const passport_http_bearer_1 = require("passport-http-bearer");
const vars_1 = require("./vars");
const authProviders = __importStar(require("../api/domain/services/authProviders"));
const user_model_1 = __importDefault(require("../api/models/user.model"));
const users_1 = require("../api/service-configurations/users");
const constants_1 = require("../api/utils/constants");
const redis_1 = __importDefault(require("./redis"));
const jwtOptions = {
    secretOrKey: vars_1.jwtSecret,
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
    passReqToCallback: true
};
const JWTAuthHandler = async (req, payload, done = () => null) => {
    try {
        const { authorization = '' } = req.headers;
        const accessToken = authorization.split(' ')[1];
        const user = await users_1.verifyUserToken(redis_1.default)
            .verifyOne(accessToken, constants_1.TOKEN_TYPE.SIGN_IN);
        if (user)
            return done(null, user);
        return done(null, false);
    }
    catch (error) {
        return done(error, false);
    }
};
const oAuth = (service) => async (token, done = () => null) => {
    try {
        //@ts-expect-error
        const userData = await authProviders[service](token);
        //@ts-expect-error
        const user = await user_model_1.default.oAuthLogin(userData);
        return done(null, user);
    }
    catch (err) {
        return done(err);
    }
};
exports.jwt = new passport_jwt_1.Strategy(jwtOptions, JWTAuthHandler);
exports.facebook = new passport_http_bearer_1.Strategy(oAuth('facebook'));
exports.google = new passport_http_bearer_1.Strategy(oAuth('google'));
