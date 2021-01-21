"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const vars_1 = require("../../config/vars");
class Token {
    constructor(secretKey = 'SAMPLE_DEFAULT_SECRET_KEY_THAT_SHOULD_NOT_BE_SHARED') {
        this.DEFAULT_SECRET_KEY = '';
        this.signOptions = {};
        this.jwt = jsonwebtoken_1.default;
        this.setSecretKey(secretKey);
    }
    /**
     * set secret key for jwt
     * @param secretKey
     */
    setSecretKey(secretKey) {
        return this.DEFAULT_SECRET_KEY = secretKey;
    }
    /**
     * set addt options for token
     * @param data
     */
    setOptions(data = {}) {
        const { subject, issuer, audience } = data;
        return this.signOptions = Object.assign({}, (subject ? { subject } : {}), (audience ? { audience } : {}), (issuer ? { issuer } : {}));
    }
    /**
     * generate new token
     * @param data // data that needed to attach to the token
     * @param duration by minutes. default 5
     * @param opt /addt option for generate new token
     */
    generate(data, duration = 5, opt = null) {
        const expiration = duration ? { expiresIn: (Math.floor(60 * duration)) } : null;
        const options = Object.assign(opt || {}, expiration || {}, this.signOptions);
        return {
            token: this.jwt.sign(data, this.DEFAULT_SECRET_KEY, options),
            expiration: expiration ? (expiration.expiresIn * 1000) + Date.now() : 0
        };
    }
    /**
     * verify the token
     * @param token
     * @param opt
     */
    verify(token, opt = null) {
        return new Promise((resolve, reject) => {
            const options = Object.assign(opt ? this.setOptions(opt) : this.signOptions);
            this.jwt.verify(token, this.DEFAULT_SECRET_KEY, options, (err, decoded) => {
                if (!err) {
                    resolve(decoded);
                }
                else {
                    reject(err);
                }
            });
        });
    }
}
exports.default = Token;
/**
 * @services
 */
exports.generateToken = (payload) => {
    return jsonwebtoken_1.default.sign({
        ...payload,
        exp: Date.now() * (vars_1.jwtExpirationInterval * 1000),
        iat: Date.now(),
    }, vars_1.jwtSecret);
};
exports.verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, vars_1.jwtSecret);
};
