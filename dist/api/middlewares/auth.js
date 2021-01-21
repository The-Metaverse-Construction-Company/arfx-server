"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.oAuth = exports.authorize = exports.LOGGED_USER = exports.ADMIN = void 0;
const http_status_1 = __importDefault(require("http-status"));
const passport_1 = __importDefault(require("passport"));
const APIError_1 = __importDefault(require("../utils/APIError"));
const users_1 = require("../domain/entities/users");
exports.ADMIN = 'admin';
exports.LOGGED_USER = '_loggedUser';
const handleJWT = (req, res, next, roles) => async (err, user, info) => {
    const error = err || info;
    //@ts-expect-error
    const logIn = Promise.promisify(req.logIn);
    const apiError = new APIError_1.default({
        message: error ? error.message : 'Unauthorized',
        status: http_status_1.default.UNAUTHORIZED,
        stack: error ? error.stack : undefined,
    });
    try {
        if (error || !user)
            throw error;
        await logIn(user, { session: false });
    }
    catch (e) {
        return next(apiError);
    }
    if (roles === exports.LOGGED_USER) {
        // if (user.role !== 'admin' && req.params.userId !== user._id.toString()) {
        //   apiError.status = httpStatus.FORBIDDEN;
        //   apiError.message = 'Forbidden';
        //   return next(apiError);
        // }
    }
    else if (!roles.includes(user.role)) {
        apiError.status = http_status_1.default.FORBIDDEN;
        apiError.message = 'Forbidden';
        return next(apiError);
    }
    else if (err || !user) {
        return next(apiError);
    }
    req.user = user;
    return next();
};
exports.authorize = (roles = users_1.ALLOWED_USER_ROLES) => (req, res, next) => passport_1.default.authenticate('jwt', { session: false }, handleJWT(req, res, next, roles))(req, res, next);
exports.oAuth = (service) => passport_1.default.authenticate(service, { session: false });
