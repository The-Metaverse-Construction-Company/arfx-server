"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STRIPE_PUBLIC_KEY = exports.STRIPE_SECRET_KEY = exports.CLIENT_HOST = exports.JWT_REFRESH_TOKEN_DURATION_MINUTES = exports.JWT_REFRESH_TOKEN_SECRET = exports.JWT_ACCESS_TOKEN_DURATION_MINUTES = exports.JWT_ACCESS_TOKEN_SECRET = exports.TOKEN_TYPE = exports.TOKEN_LABEL = void 0;
exports.TOKEN_LABEL = {
    REFRESH: 'REFRESH_TOKEN',
    ACCESS: 'ACCESS_TOKEN'
};
exports.TOKEN_TYPE = {
    SIGN_UP: 'SIGN_UP',
    SIGN_IN: 'SIGN_IN',
    RESET_PASSWORD: 'RESET_PASSWORD',
};
// ENV VARIABLES
exports.JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET || '';
exports.JWT_ACCESS_TOKEN_DURATION_MINUTES = process.env.JWT_ACCESS_TOKEN_EXPIRATION_MINUTES ? parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRATION_MINUTES) : 60;
// refresh token
exports.JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET || '';
exports.JWT_REFRESH_TOKEN_DURATION_MINUTES = process.env.JWT_REFRESH_TOKEN_EXPIRATION_MINUTES ? (parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRATION_MINUTES) * (24 * 60)) : (10 * (24 * 60));
// CLIENTS/FRONTEND //
exports.CLIENT_HOST = process.env.CLIENT_HOST || `http://localhost:3001`;
/// STRIPE KEYS ////
exports.STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
exports.STRIPE_PUBLIC_KEY = process.env.STRIPE_PUBLIC_KEY || '';
