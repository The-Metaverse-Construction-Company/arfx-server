"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUserToken = exports.findOneById = exports.userList = exports.validateUserEmail = void 0;
const users_1 = require("../domain/services/users");
const user_token_1 = __importDefault(require("../helper/user-token"));
exports.validateUserEmail = () => (new users_1.ValidateUserEmail());
exports.userList = users_1.UserList();
exports.findOneById = users_1.FindOneById();
exports.verifyUserToken = (redis) => (new users_1.VerifyUserToken({
    findUserById: exports.findOneById,
    verifyToken: new user_token_1.default({ redisClient: redis }).verifyAccessToken
}));
