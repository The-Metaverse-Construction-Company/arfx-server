/**
 * @libraries
 */
import httpStatus from 'http-status'
import moment from 'moment-timezone'
import express, {
  Response, Request, NextFunction
} from 'express'

import {
  userSignInService,
  userSignOutService
} from '../service-configurations/sign-in'

import {
  userVerifyToken
} from '../service-configurations/users'

import {ALLOWED_USER_ROLE} from '../domain/entities/users/index'
// import User from '../models/user.model'
import * as emailProvider from '../domain/services/emails/emailProvider'
import { successReponse } from '../helper/http-response'
import { TOKEN_TYPE } from '../utils/constants'

const RefreshToken = require('../models/refreshToken.model');
const { jwtExpirationInterval } = require('../../config/vars');

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
    const response = await userSignInService(redisPublisher)
      .signIn({
        username: username.trim(),
        password: password.trim()
      })
    // const { user, accessToken } = await User.findAndGenerateToken(req.body);
    // const token = generateTokenResponse(user, accessToken);
    // const userTransformed = user.transform();
    res.status(httpStatus.OK).send(successReponse(response))
  } catch (error) {
    return next(error);
  }
};
/**
 * Returns jwt token if valid username and password is provided
 * @public
 */
export const userSignOutRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {authorization = ''} = req.headers
    const accessToken = authorization.split(' ')[1]
    let redisPublisher = req.app.get('redisPublisher')
    const user = await userVerifyToken(redisPublisher)
      .verifyOne(accessToken, TOKEN_TYPE.SIGN_IN)
      .catch(() => null)
    if (!user) {
      res.status(httpStatus.OK).send(successReponse(false))
      return
    }
    const response = await userSignOutService(redisPublisher)
      .signOut(user._id)
    res.status(httpStatus.OK).send(successReponse(response))
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
