import httpStatus from 'http-status'
import {
  Response, Request, NextFunction
} from 'express'
import moment from 'moment-timezone'
import {
  userSignUp
} from '../service-configurations/users'
import {ALLOWED_USER_ROLE} from '../domain/entities/users/index'
import User from '../models/user.model'
const RefreshToken = require('../models/refreshToken.model');
const PasswordResetToken = require('../models/passwordResetToken.model');
const { jwtExpirationInterval } = require('../../config/vars');

const APIError = require('../utils/APIError');
const emailProvider = require('../services/emails/emailProvider');

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
    // const userData = omit(req.body, 'role');
    const newUser = await userSignUp()
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
    //@ts-expect-error
    return next(User.checkDuplicateEmail(error));
  }
};

/**
 * Returns jwt token if valid username and password is provided
 * @public
 */
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //@ts-expect-error
    const { user, accessToken } = await User.findAndGenerateToken(req.body);
    const token = generateTokenResponse(user, accessToken);
    const userTransformed = user.transform();
    return res.json({ token, user: userTransformed });
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
    const user = await User.findOne({ email }).exec();

    if (user) {
      const passwordResetObj = await PasswordResetToken.generate(user);
      emailProvider.sendPasswordReset(passwordResetObj);
      res.status(httpStatus.OK);
      return res.json('success');
    }
    throw new APIError({
      status: httpStatus.UNAUTHORIZED,
      message: 'No account found with that email',
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
