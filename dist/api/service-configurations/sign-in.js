"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSignOut = exports.userSignIn = void 0;
const sign_in_1 = require("../domain/services/sign-in");
const user_token_1 = __importDefault(require("../helper/user-token"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const repository_1 = require("../../app-plugins/persistence/repository");
exports.userSignIn = (redis) => (new sign_in_1.UserSignIn({
    repositoryGateway: new repository_1.UserRepository(),
    comparePassword: bcryptjs_1.default.compareSync,
    generateToken: new user_token_1.default({ redisClient: redis }).generateAccessToken
}));
exports.userSignOut = (redis) => (new sign_in_1.UserSignOut({
    revokeToken: new user_token_1.default({ redisClient: redis }).removeAccessToken
}));
