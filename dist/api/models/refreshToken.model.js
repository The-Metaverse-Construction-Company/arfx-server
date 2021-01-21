"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const crypto_1 = __importDefault(require("crypto"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
/**
 * Refresh Token Schema
 * @private
 */
const refreshTokenSchema = new mongoose_1.default.Schema({
    token: {
        type: String,
        required: true,
        index: true,
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    userEmail: {
        type: 'String',
        ref: 'User',
        required: true,
    },
    expires: { type: Date },
});
refreshTokenSchema.statics = {
    /**
     * Generate a refresh token object and saves it into the database
     *
     * @param {User} user
     * @returns {RefreshToken}
     */
    generate(user) {
        const userId = user._id;
        const userEmail = user.email;
        const token = `${userId}.${crypto_1.default.randomBytes(40).toString('hex')}`;
        const expires = moment_timezone_1.default().add(30, 'days').toDate();
        const tokenObject = new RefreshToken({
            token, userId, userEmail, expires,
        });
        tokenObject.save();
        return tokenObject;
    },
};
/**
 * @typedef RefreshToken
 */
const RefreshToken = mongoose_1.default.model('RefreshToken', refreshTokenSchema);
module.exports = RefreshToken;
