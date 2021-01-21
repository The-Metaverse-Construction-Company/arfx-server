"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateResetPasswordValidation = exports.verifyResetPasswordToken = exports.sendPasswordReset = exports.refresh = exports.oAuth = exports.login = exports.register = void 0;
const joi_1 = __importDefault(require("joi"));
// POST /v1/auth/register
exports.register = {
    body: {
        email: joi_1.default.string()
            .email()
            .required(),
        password: joi_1.default.string()
            .required()
            .min(6)
            .max(128),
    },
};
// POST /v1/auth/login
exports.login = {
    body: {
        username: joi_1.default.string()
            .email()
            .required(),
        password: joi_1.default.string()
            .required()
            .max(128),
    },
};
// POST /v1/auth/facebook
// POST /v1/auth/google
exports.oAuth = {
    body: {
        access_token: joi_1.default.string().required(),
    },
};
// POST /v1/auth/refresh
exports.refresh = {
    body: {
        email: joi_1.default.string()
            .email()
            .required(),
        refreshToken: joi_1.default.string().required(),
    },
};
// POST /v1/auth/reset-password
exports.sendPasswordReset = {
    body: {
        email: joi_1.default.string()
            .email()
            .required(),
    },
};
// GET /v1/auth/reset-password
exports.verifyResetPasswordToken = {
    query: {
        token: joi_1.default.string()
            .required(),
    },
};
// POST /v1/auth/password-reset
exports.updateResetPasswordValidation = {
    body: {
        password: joi_1.default.string()
            .required()
            .min(6)
            .max(128)
    },
};
