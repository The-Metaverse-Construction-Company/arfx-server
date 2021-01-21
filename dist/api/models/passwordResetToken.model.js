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
const passwordResetTokenSchema = new mongoose_1.default.Schema({
    resetToken: {
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
passwordResetTokenSchema.statics = {
    /**
     * Generate a reset token object and saves it into the database
     *
     * @param {User} user
     * @returns {ResetToken}
     */
    async generate(user) {
        const userId = user._id;
        const userEmail = user.email;
        const resetToken = `${userId}.${crypto_1.default.randomBytes(40).toString('hex')}`;
        const expires = moment_timezone_1.default()
            .add(2, 'hours')
            .toDate();
        const ResetTokenObject = new PasswordResetToken({
            resetToken,
            userId,
            userEmail,
            expires,
        });
        await ResetTokenObject.save();
        return ResetTokenObject;
    },
};
/**
 * @typedef RefreshToken
 */
const PasswordResetToken = mongoose_1.default.model('PasswordResetToken', passwordResetTokenSchema);
module.exports = PasswordResetToken;
