import httpStatus from 'http-status'
import express, {
  Response, Request, NextFunction
} from 'express'
import moment from 'moment-timezone'
import {
  userSignUp, verifyUser
} from '../service-configurations/sign-up'
import {
  userSignIn
} from '../service-configurations/sign-in'

import {
  sendResetPassword,
  updateResetPassword,
  verifyResetPassword
} from '../service-configurations/reset-password'

import {ALLOWED_USER_ROLE} from '../domain/entities/users/index'
import User from '../models/user.model'
import * as emailProvider from '../domain/services/emails/emailProvider'

import Token from '../helper/token'
import { JWT_ACCESS_TOKEN_SECRET } from '../utils/constants'
const RefreshToken = require('../models/refreshToken.model');
const PasswordResetToken = require('../models/passwordResetToken.model');
const { jwtExpirationInterval } = require('../../config/vars');

const APIError = require('../utils/APIError');

/**
 * Returns a formated object with tokens
 * @private
 */
function generateTokenResponse(user: any, accessToken: string) {
  const tokenType = 'Bearer';
  const refreshToken = RefreshToken.generate(user).token;
  const expiresIn = moment().add(jwtExpirationInterval, 'minutes');
  return {
    tokenType,
    accessToken,
    refreshToken,
    expiresIn,
  };
}

/**
 * Returns jwt token if registration was successful
 * @public
 */
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let redisPublisher = req.app.get('redisPublisher')
    const newUser = await userSignUp(redisPublisher)
      .signIn({
        ...req.body,
        role: ALLOWED_USER_ROLE.USER
      })
    // const token = generateTokenResponse(user, user.token());
    res.status(httpStatus.CREATED);
    //@ts-ignore
    delete newUser.password
    return res.json({ user: newUser });
    // return res.json({ token, user: newUser });
  } catch (error) {
    next(error);
  }
};
/**
 * Returns jwt token if registration was successful
 * @public
 */
export const verifyUserRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let redisPublisher = req.app.get('redisPublisher')
    const {token = ''} = <any>req.query
    const newUser = await verifyUser(redisPublisher)
      .verifyOne(token)
    // const token = generateTokenResponse(user, user.token());
    res.status(httpStatus.OK);
    //@ts-ignore
    // delete newUser.password
    return res.json({ user: newUser });
    // return res.json({ token, user: newUser });
  } catch (error) {
    next(error)
  }
};

/**
 * Returns jwt token if valid username and password is provided
 * @public
 */
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      username = '',
      password = '',
    } = req.body
    let redisPublisher = req.app.get('redisPublisher')
    const response = await userSignIn(redisPublisher).signIn({
      username: username.trim(),
      password: password.trim()
    })
    // const { user, accessToken } = await User.findAndGenerateToken(req.body);
    // const token = generateTokenResponse(user, accessToken);
    // const userTransformed = user.transform();
    return res.json(response);
  } catch (error) {
    return next(error);
  }
};

/**
 * login with an existing user or creates a new one if valid accessToken token
 * Returns jwt token
 * @public
 */
export const oAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user } = req;
    //@ts-expect-error
    const accessToken = user.token();
    const token = generateTokenResponse(user, accessToken);
    //@ts-expect-error
    const userTransformed = user.transform();
    return res.json({ token, user: userTransformed });
  } catch (error) {
    return next(error);
  }
};

/**
 * Returns a new jwt when given a valid refresh token
 * @public
 */
export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, refreshToken } = req.body;
    const refreshObject = await RefreshToken.findOneAndRemove({
      userEmail: email,
      token: refreshToken,
    });
    //@ts-expect-error
    const { user, accessToken } = await User.findAndGenerateToken({ email, refreshObject });
    const response = generateTokenResponse(user, accessToken);
    return res.json(response);
  } catch (error) {
    return next(error);
  }
};

export const sendPasswordReset = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    const redisPublish = req.app.get('redisPublisher')
    const response = await sendResetPassword(redisPublish).resetOne(email)
    res.status(httpStatus.OK);
    res.json({
      result: response
    });
  } catch (error) {
    return next(error);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, resetToken } = req.body;
    const resetTokenObject = await PasswordResetToken.findOneAndRemove({
      userEmail: email,
      resetToken,
    });

    const err = {
      status: httpStatus.UNAUTHORIZED,
      isPublic: true,
    };
    if (!resetTokenObject) {
      // err.message = 'Cannot find matching reset token';
      throw new APIError(err);
    }
    if (moment().isAfter(resetTokenObject.expires)) {
      // err.message = 'Reset token is expired';
      throw new APIError(err);
    }

    const user = await User.findOne({ email: resetTokenObject.userEmail }).exec();
    if (!user) {
      throw new Error('No user found.')
    }
    user.password = password;
    await user.save();
    emailProvider.sendPasswordChangeEmail(user);

    res.status(httpStatus.OK);
    return res.json('Password Updated');
  } catch (error) {
    return next(error);
  }
};
