"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userVerifyToken = exports.userDetails = exports.userListService = exports.validateUserEmail = void 0;
const users_1 = require("../domain/services/users");
const repository_1 = require("../../app-plugins/persistence/repository");
const user_token_1 = __importDefault(require("../helper/user-token"));
exports.validateUserEmail = () => (new users_1.ValidateDuplicateEmail({ repositoryGateway: new repository_1.UserRepository() }));
exports.userListService = () => (new users_1.UserList({ repositoryGateway: new repository_1.UserRepository() }));
exports.userDetails = () => (new users_1.UserDetails({ repositoryGateway: new repository_1.UserRepository() }));
exports.userVerifyToken = (redis) => (new users_1.UserVerifyToken({
    userDetails: exports.userDetails(),
    verifyToken: new user_token_1.default({ redisClient: redis }).verifyAccessToken
}));
