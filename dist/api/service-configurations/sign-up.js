"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySignUpToken = exports.verifyUser = exports.userSignUp = void 0;
const payment_gateway_1 = __importDefault(require("../../config/payment-gateway"));
const sign_up_1 = require("../domain/services/sign-up");
const email_1 = require("./email");
const users_1 = require("./users");
const repository_1 = require("../../app-plugins/persistence/repository");
const user_token_1 = __importDefault(require("../helper/user-token"));
exports.userSignUp = (redis) => (new sign_up_1.UserSignUpService({
    repositoryGateway: new repository_1.UserRepository(),
    generateToken: (new user_token_1.default({ redisClient: redis })).generateAccessToken,
    sendEmail: email_1.sendVerificationEmail().sendOne,
    validateEmail: users_1.validateUserEmail().validateOne
}));
exports.verifyUser = (redis) => {
    const authToken = new user_token_1.default({ redisClient: redis });
    return new sign_up_1.VerifiedUserService({
        revokeToken: authToken.removeAccessToken,
        repositoryGateway: new repository_1.UserRepository(),
        userDetails: users_1.userDetails(),
        createPaymentGatewayAccount: payment_gateway_1.default.customer.create,
    });
};
exports.verifySignUpToken = (redis) => {
    return new sign_up_1.VerifyUserTokenService({
        verifyUserToken: users_1.userVerifyToken(redis)
    });
};
