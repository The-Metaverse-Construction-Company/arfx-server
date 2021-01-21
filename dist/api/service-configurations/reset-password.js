"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateResetPassword = exports.sendResetPassword = void 0;
const reset_password_1 = require("../domain/services/reset-password");
const user_token_1 = __importDefault(require("../helper/user-token"));
const users_1 = require("./users");
const email_1 = require("./email");
const repository_1 = require("../../app-plugins/persistence/repository");
exports.sendResetPassword = (redis) => (new reset_password_1.UserResetPasswordService({
    repositoryGateway: new repository_1.UserRepository(),
    generateToken: new user_token_1.default({ redisClient: redis }).generateAccessToken,
    sendEmail: email_1.sendResetPasswordEmail().sendOne
}));
exports.updateResetPassword = (redis) => (new reset_password_1.UserVerifyResetPasswordService({
    repositoryGateway: new repository_1.UserRepository(),
    userDetails: users_1.userDetails(),
    revokeToken: new user_token_1.default({ redisClient: redis }).removeAccessToken
}));
