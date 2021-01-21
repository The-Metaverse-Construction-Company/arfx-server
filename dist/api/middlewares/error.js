"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = exports.converter = exports.handler = void 0;
const http_status_1 = __importDefault(require("http-status"));
const express_validation_1 = __importDefault(require("express-validation"));
const APIError_1 = __importDefault(require("../utils/APIError"));
const vars_1 = require("../../config/vars");
/**
 * Error handler. Send stacktrace only during development
 * @public
 */
const requestHandler = (err, req, res, next) => {
    const response = {
        code: err.status,
        message: err.message || http_status_1.default[err.status],
        errors: err.errors,
        stack: err.stack,
    };
    if (vars_1.env !== 'development') {
        delete response.stack;
    }
    res.status(err.status);
    res.json(response);
};
exports.handler = requestHandler;
/**
 * If error is not an instanceOf APIError, convert it.
 * @public
 */
exports.converter = (err, req, res, next) => {
    let convertedError = err;
    if (err instanceof express_validation_1.default.ValidationError) {
        convertedError = new APIError_1.default({
            message: 'Validation Error',
            errors: err.errors,
            status: err.status,
            //@ts-expect-error
            stack: err.stack,
        });
    }
    else if (!(err instanceof APIError_1.default)) {
        convertedError = new APIError_1.default({
            message: err.message,
            status: err.status,
            stack: err.stack,
        });
    }
    return requestHandler(convertedError, req, res, next);
};
/**
 * Catch 404 and forward to error handler
 * @public
 */
exports.notFound = (req, res, next) => {
    const err = new APIError_1.default({
        message: 'Not found',
        status: http_status_1.default.NOT_FOUND,
    });
    return requestHandler(err, req, res, next);
};
