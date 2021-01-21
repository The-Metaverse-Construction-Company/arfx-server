"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.list = exports.update = exports.replace = exports.create = exports.loggedIn = exports.get = exports.load = void 0;
const http_status_1 = __importDefault(require("http-status"));
const sign_up_1 = require("../service-configurations/sign-up");
const users_1 = require("../service-configurations/users");
const index_1 = require("../domain/entities/users/index");
const { omit } = require('lodash');
const User = require('../models/user.model');
/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
    try {
        const user = await User.get(id);
        //@ts-expect-error
        req.locals = { user };
        return next();
    }
    catch (error) {
        return next(error);
    }
};
/**
 * Get user
 * @public
 */
exports.get = (req, res) => {
    //@ts-expect-error
    res.json(req.locals.user.transform());
};
/**
 * Get logged in user info
 * @public
 */
exports.loggedIn = (req, res) => {
    res.json(JSON.parse(JSON.stringify(req.user)));
};
/**
 * Create new user
 * @public
 */
exports.create = async (req, res, next) => {
    try {
        const redisPublisher = req.app.get('redisPublisher');
        const newUser = await sign_up_1.userSignUp(redisPublisher)
            .createOne({
            ...req.body,
            role: index_1.ALLOWED_USER_ROLE.USER
        });
        // const user = new User(req.body);
        // const savedUser = await user.save();
        res.status(http_status_1.default.CREATED).json(newUser);
    }
    catch (error) {
        console.log('error :>> ', error);
        next(User.checkDuplicateEmail(error));
    }
};
/**
 * Replace existing user
 * @public
 */
exports.replace = async (req, res, next) => {
    try {
        //@ts-expect-error
        const { user } = req.locals;
        const newUser = new User(req.body);
        const ommitRole = user.role !== 'admin' ? 'role' : '';
        const newUserObject = omit(newUser.toObject(), '_id', ommitRole);
        await user.updateOne(newUserObject, { override: true, upsert: true });
        const savedUser = await User.findById(user._id);
        res.json(savedUser.transform());
    }
    catch (error) {
        next(User.checkDuplicateEmail(error));
    }
};
/**
 * Update existing user
 * @public
 */
exports.update = (req, res, next) => {
    //@ts-expect-error
    const ommitRole = req.locals.user.role !== 'admin' ? 'role' : '';
    const updatedUser = omit(req.body, ommitRole);
    //@ts-expect-error
    const user = Object.assign(req.locals.user, updatedUser);
    user.save()
        .then((savedUser) => res.json(savedUser.transform()))
        .catch((e) => next(User.checkDuplicateEmail(e)));
};
/**
 * Get user list
 * @public
 */
exports.list = async (req, res, next) => {
    try {
        const users = await users_1.userList({
            ...req.query,
        });
        res.json(users);
    }
    catch (error) {
        next(error);
    }
};
/**
 * Delete user
 * @public
 */
exports.remove = (req, res, next) => {
    //@ts-expect-error
    const { user } = req.locals;
    user.remove()
        .then(() => res.status(http_status_1.default.NO_CONTENT).end())
        .catch((e) => next(e));
};
