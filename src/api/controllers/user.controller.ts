import httpStatus from 'http-status'
import {
  Request, Response, NextFunction,
} from 'express'
import {
  userSignUp,
} from '../service-configurations/sign-up'
import {
  userListService,
  userDetails,
  sendUserOTPService,
  updateUserService,
  createUserService
} from '../service-configurations/users'

import {ALLOWED_USER_ROLE} from '../domain/entities/users/index'
import { TOKEN_TYPE } from '../utils/constants'
import { successReponse } from '../helper/http-response'
const { omit } = require('lodash');
const User = require('../models/user.model');

/**
 * Load user and append to req.
 * @public
 */
export const UserDetailsMiddleware = async (req: Request, res: Response, next: NextFunction, id: any) => {
  try {
    const user = await userDetails()
      .findOne(id);
    res.locals['user'] = user
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Get user
 * @public
 */
export const UserDetailsRoute = (req: Request, res: Response) => {
  res.json(res.locals['user']);
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
export const CreateUserRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newUser = await createUserService()
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
 * Update existing user
 * @public
 */
export const UpdateUserRoute = (req: Request, res: Response, next: NextFunction) => {
  const {userId = ''} = req.params
  updateUserService()
    .updateOne(userId, req.body)
    .then((user: any) => res.json(successReponse(user)))
    .catch((e: Error) => next(e));
};

/**
 * Get user list
 * @public
 */
export const UserListRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userListService()
      .getList({
        ...req.query,
      })
    res.json(successReponse(users));
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 * @public
 */
export const RemoveUserRoute = (req: Request, res: Response, next: NextFunction) => {
  // const { user } = req.locals;

  // user.remove()
  //   .then(() => res.status(httpStatus.NO_CONTENT).end())
  //   .catch((e: Error) => next(e));
};
/**
 * resend a otp
 * @public
 */
export const resendAccountVerificationOTPRoute = (req: Request, res: Response, next: NextFunction) => {
  const {userId} = req.params
  const redis = req.app.get('redisPublisher')
  sendUserOTPService(redis)
    .sendOne(userId, TOKEN_TYPE.SIGN_UP)
    .then((otp) => {
      res.status(httpStatus.OK).send(successReponse({code: otp}))
    })
    .catch((e: Error) => next(e));
};
