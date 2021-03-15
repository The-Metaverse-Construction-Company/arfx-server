/**
 * @libraries
 */
import httpStatus from 'http-status'
import {
  Response, Request, NextFunction
} from 'express'

import {
  userSignInService,
  userSignOutService
} from '../service-configurations/sign-in'

import {
  userVerifyToken
} from '../service-configurations/users'

import { successReponse } from '../helper/http-response'
import { TOKEN_TYPE } from '../utils/constants'
import AppError from '../utils/response-error'

/**
 * Returns jwt token if valid username and password is provided
 * @public
 */
export const userSignInRoute = async (req: Request, res: Response, next: NextFunction) => {
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
    next(new AppError({
      message: error.message,
      httpStatus: httpStatus.BAD_REQUEST
    }))
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
    next(new AppError({
      message: error.message,
      httpStatus: httpStatus.BAD_REQUEST
    }))
  }
};