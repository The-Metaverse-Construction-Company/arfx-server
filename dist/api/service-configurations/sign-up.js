"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySignUpToken = exports.verifyUser = exports.userSignUp = void 0;
const sign_up_1 = require("../domain/services/sign-up");
const email_1 = require("./email");
const users_1 = require("./users");
const user_token_1 = __importDefault(require("../helper/user-token"));
exports.userSignUp = (redis) => (new sign_up_1.UserSignUp({
    generateToken: (new user_token_1.default({ redisClient: redis })).generateAccessToken,
    sendEmail: email_1.sendVerificationEmail().sendOne,
    validateEmail: users_1.validateUserEmail().validateOne
}));
exports.verifyUser = (redis) => {
    const authToken = new user_token_1.default({ redisClient: redis });
    return new sign_up_1.VerifyUser({
        revokeToken: authToken.removeAccessToken,
        findOneById: users_1.findOneById
    });
};
exports.verifySignUpToken = (redis) => {
    return new sign_up_1.VerifyToken({
        verifyUserToken: users_1.verifyUserToken(redis)
    });
};
