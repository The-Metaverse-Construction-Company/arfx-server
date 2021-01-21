"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwt = void 0;
const passport_jwt_1 = require("passport-jwt");
const vars_1 = require("./vars");
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
        const user = await users_1.userVerifyToken(redis_1.default)
            .verifyOne(accessToken, constants_1.TOKEN_TYPE.SIGN_IN);
        if (user)
            return done(null, user);
        return done(null, false);
    }
    catch (error) {
        return done(error, false);
    }
};
// const oAuth = (service: string) => async (token: string, done: any = () => null) => {
//   try {
//     //@ts-expect-error
//     const userData = await authProviders[service](token);
//     //@ts-expect-error
//     const user = await User.oAuthLogin(userData);
//     return done(null, user);
//   } catch (err) {
//     return done(err);
//   }
// };
exports.jwt = new passport_jwt_1.Strategy(jwtOptions, JWTAuthHandler);
// export const facebook = new BearerStrategy(oAuth('facebook'));
// export const google = new BearerStrategy(oAuth('google'));
