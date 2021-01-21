"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.replaceUser = exports.createUser = exports.listUsers = void 0;
const joi_1 = __importDefault(require("joi"));
const users_1 = require("../domain/entities/users");
const allowed_roles = Object.values(users_1.ALLOWED_USER_ROLE);
// GET /v1/users
exports.listUsers = {
    query: {
        page: joi_1.default.number().min(1),
        perPage: joi_1.default.number().min(1).max(100),
        name: joi_1.default.string(),
        email: joi_1.default.string(),
        role: joi_1.default.string().valid(allowed_roles),
    },
};
// POST /v1/users
exports.createUser = {
    body: {
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().min(6).max(128).required(),
        name: joi_1.default.string().max(128),
        role: joi_1.default.string().valid(allowed_roles),
    },
};
// PUT /v1/users/:userId
exports.replaceUser = {
    body: {
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().min(6).max(128).required(),
        name: joi_1.default.string().max(128),
        role: joi_1.default.string().valid(allowed_roles),
    },
    params: {
        userId: joi_1.default.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
};
// PATCH /v1/users/:userId
exports.updateUser = {
    body: {
        email: joi_1.default.string().email(),
        password: joi_1.default.string().min(6).max(128),
        name: joi_1.default.string().max(128),
        role: joi_1.default.string().valid(allowed_roles),
    },
    params: {
        userId: joi_1.default.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
};
