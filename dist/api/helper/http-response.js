"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorResponse = exports.successReponse = void 0;
exports.successReponse = (data) => {
    return {
        success: true,
        result: data,
        error: null
    };
};
exports.errorResponse = (error) => {
    return {
        success: true,
        result: null,
        error: error
    };
};
