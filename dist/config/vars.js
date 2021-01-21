"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailConfig = exports.logs = exports.mongo = exports.jwtExpirationInterval = exports.jwtSecret = exports.port = exports.env = void 0;
const path_1 = __importDefault(require("path"));
// import .env variables
require('dotenv-safe').load({
    path: path_1.default.join(__dirname, '../../.env.local'),
    sample: path_1.default.join(__dirname, '../../.env.example'),
});
exports.env = process.env.NODE_ENV || '';
exports.port = process.env.PORT || '';
exports.jwtSecret = process.env.JWT_SECRET || '';
exports.jwtExpirationInterval = process.env.JWT_EXPIRATION_MINUTES ? parseInt(process.env.JWT_EXPIRATION_MINUTES) : 60;
exports.mongo = {
    uri: process.env.NODE_ENV === 'test' ? process.env.MONGO_URI_TESTS : process.env.MONGO_URI,
};
exports.logs = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
exports.emailConfig = {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    username: process.env.EMAIL_USERNAME,
    password: process.env.EMAIL_PASSWORD,
};
