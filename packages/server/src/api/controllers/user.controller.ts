import httpStatus from 'http-status'
import {
  Request, Response, NextFunction,
} from 'express'
const {UserSignUp} = require('../services/users/sign-up')
const { omit } = require('lodash');
const User = require('../models/user.model');
const { ALLOWED_USER_ROLE } = require('../entities/users/constants');

/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req: Request, res: Response, next: NextFunction, id: any) => {
  try {
    const user = await User.get(id);
  //@ts-expect-error
    req.locals = { user };
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Get user
 * @public
 */
exports.get = (req: Request, res: Response) => {
  //@ts-expect-error
  res.json(req.locals.user.transform());
}

/**
 * Get logged in user info
 * @public
 */
exports.loggedIn = (req: Request, res: Response) => {
  res.json(JSON.parse(JSON.stringify(req.user)));
}

/**
 * Create new user
 * @public
 */
exports.create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newUser = await new UserSignUp()
      .signIn({
        ...req.body,
        role: ALLOWED_USER_ROLE.USER
      })
    // const user = new User(req.body);
    // const savedUser = await user.save();
    res.status(httpStatus.CREATED).json(newUser);
  } catch (error) {
    console.log('error :>> ', error);
    next(User.checkDuplicateEmail(error));
  }
};

/**
 * Replace existing user
 * @public
 */
exports.replace = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //@ts-expect-error
    const { user } = req.locals;
    const newUser = new User(req.body);
    const ommitRole = user.role !== 'admin' ? 'role' : '';
    const newUserObject = omit(newUser.toObject(), '_id', ommitRole);

    await user.updateOne(newUserObject, { override: true, upsert: true });
    const savedUser = await User.findById(user._id);

    res.json(savedUser.transform());
  } catch (error) {
    next(User.checkDuplicateEmail(error));
  }
};

/**
 * Update existing user
 * @public
 */
exports.update = (req: Request, res: Response, next: NextFunction) => {
    //@ts-expect-error
  const ommitRole = req.locals.user.role !== 'admin' ? 'role' : '';
  const updatedUser = omit(req.body, ommitRole);
    //@ts-expect-error
  const user = Object.assign(req.locals.user, updatedUser);

  user.save()
    .then((savedUser: any) => res.json(savedUser.transform()))
    .catch((e: Error) => next(User.checkDuplicateEmail(e)));
};

/**
 * Get user list
 * @public
 */
exports.list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.list(req.query);
    // const transformedUsers = users.map(user => user.transform());
    res.json(users);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 * @public
 */
exports.remove = (req: Request, res: Response, next: NextFunction) => {
    //@ts-expect-error
  const { user } = req.locals;

  user.remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch((e: Error) => next(e));
};
