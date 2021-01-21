"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const http_status_1 = __importDefault(require("http-status"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const jwt_simple_1 = __importDefault(require("jwt-simple"));
const uuid_1 = require("uuid");
const { omitBy, isNil } = require('lodash');
const APIError = require('../utils/APIError');
const { env, jwtSecret, jwtExpirationInterval } = require('../../config/vars');
/**
* User Roles
*/
const roles = ['user', 'admin'];
/**
 * User Schema
 * @private
 */
const userSchema = new mongoose_1.default.Schema({
    _id: {
        type: String,
        default: ''
    },
    email: {
        value: {
            type: String,
            match: /^\S+@\S+\.\S+$/,
            required: true,
            // unique: true,
            trim: true,
            lowercase: true,
        },
        verified: {
            type: Boolean,
            default: false
        },
        verifiedAt: {
            type: Number,
            default: 0
        }
    },
    mobileNumber: {
        value: {
            type: String,
            trim: true,
            lowercase: true,
        },
        verified: {
            type: Boolean,
            default: false
        },
        verifiedAt: {
            type: Number,
            default: 0
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 128,
    },
    name: {
        type: String,
        maxlength: 128,
        index: true,
        trim: true,
    },
    services: {
        facebook: String,
        google: String,
    },
    role: {
        type: String,
        enum: roles,
        default: 'user',
    },
    avatarUrl: {
        type: String,
        trim: true,
    },
    updatedAt: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Number,
        default: 0
    },
});
/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
// userSchema.pre('save', async function save(next) {
//   try {
//     if (!this.isModified('password')) return next();
//     const rounds = env === 'test' ? 1 : 10;
//     const hash = await bcrypt.hash(this.password, rounds);
//     this.password = hash;
//     return next();
//   } catch (error) {
//     return next(error);
//   }
// });
/**
 * Methods
 */
userSchema.method({
    token() {
        const playload = {
            exp: moment_timezone_1.default().add(jwtExpirationInterval, 'minutes').unix(),
            iat: moment_timezone_1.default().unix(),
            sub: this._id,
        };
        return jwt_simple_1.default.encode(playload, jwtSecret);
    },
    async passwordMatches(password) {
        //@ts-expect-error
        return bcryptjs_1.default.compare(password, this.password);
    },
});
/**
 * Statics
 */
userSchema.statics = {
    /**
     * Get user
     *
     * @param {ObjectId} id - The objectId of user.
     * @returns {Promise<User, APIError>}
     */
    async get(id) {
        try {
            let user;
            if (mongoose_1.default.Types.ObjectId.isValid(id)) {
                user = await this.findById(id).exec();
            }
            if (user) {
                return user;
            }
            throw new APIError({
                message: 'User does not exist',
                status: http_status_1.default.NOT_FOUND,
            });
        }
        catch (error) {
            throw error;
        }
    },
    /**
     * Find user by email and tries to generate a JWT token
     *
     * @param {ObjectId} id - The objectId of user.
     * @returns {Promise<User, APIError>}
     */
    async findAndGenerateToken(options) {
        const { email, password, refreshObject } = options;
        if (!email)
            throw new APIError({ message: 'An email is required to generate a token' });
        const user = await this.findOne({ email }).exec();
        const err = {
            status: http_status_1.default.UNAUTHORIZED,
            isPublic: true,
        };
        if (password) {
            //@ts-expect-error
            if (user && await user.passwordMatches(password)) {
                //@ts-expect-error
                return { user, accessToken: user.token() };
            }
            err.message = 'Incorrect email or password';
        }
        else if (refreshObject && refreshObject.userEmail === email) {
            if (moment_timezone_1.default(refreshObject.expires).isBefore()) {
                err.message = 'Invalid refresh token.';
            }
            else {
                //@ts-expect-error
                return { user, accessToken: user.token() };
            }
        }
        else {
            err.message = 'Incorrect email or refreshToken';
        }
        throw new APIError(err);
    },
    /**
     * List users in descending order of 'createdAt' timestamp.
     *
     * @param {number} skip - Number of users to be skipped.
     * @param {number} limit - Limit number of users to be returned.
     * @returns {Promise<User[]>}
     */
    list({ page = 1, perPage = 30, name, email, role, }) {
        const options = omitBy({ name, email, role }, isNil);
        return this.find(options)
            .sort({ createdAt: -1 })
            .skip(perPage * (page - 1))
            .limit(perPage)
            .exec();
    },
    async oAuthLogin({ service, id, email, name, picture, }) {
        const user = await this.findOne({ $or: [{ [`services.${service}`]: id }, { email }] });
        if (user) {
            //@ts-expect-error
            user.services[service] = id;
            //@ts-expect-error
            if (!user.name)
                user.name = name;
            //@ts-expect-error
            if (!user.picture)
                user.picture = picture;
            return user.save();
        }
        const password = uuid_1.v4();
        return this.create({
            services: { [service]: id }, email, password, name, picture,
        });
    },
};
/**
 * @typedef User
 */
exports.default = mongoose_1.default.model('User', userSchema);
