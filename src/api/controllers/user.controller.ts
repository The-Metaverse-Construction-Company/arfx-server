import httpStatus from 'http-status'
import {
  Request, Response, NextFunction,
} from 'express'
import {
  userSignUp,
} from '../service-configurations/sign-up'
import {
  userListService
} from '../service-configurations/users'

import {ALLOWED_USER_ROLE} from '../domain/entities/users/index'
const { omit } = require('lodash');
const User = require('../models/user.model');

/**
 * Load user and append to req.
 * @public
 */
export const load = async (req: Request, res: Response, next: NextFunction, id: any) => {
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
export const get = (req: Request, res: Response) => {
  //@ts-expect-error
  res.json(req.locals.user.transform());
}

/**
 * Get logged in user info
 * @public
 */
export const loggedIn = (req: Request, res: Response) => {
  res.json(JSON.parse(JSON.stringify(req.user)));
}

/**
 * Create new user
 * @public
 */
export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const redisPublisher = req.app.get('redisPublisher')
    const newUser = await userSignUp(redisPublisher)
      .createOne({
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
export const replace = async (req: Request, res: Response, next: NextFunction) => {
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
export const update = (req: Request, res: Response, next: NextFunction) => {
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
export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userListService()
      .getList({
        ...req.query,
      })
    res.json(users);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 * @public
 */
export const remove = (req: Request, res: Response, next: NextFunction) => {
    //@ts-expect-error
  const { user } = req.locals;

  user.remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch((e: Error) => next(e));
};
