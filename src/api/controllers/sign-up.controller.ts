import httpStatus from 'http-status'
import {
  Response, Request, NextFunction
} from 'express'
import {
  userSignUp, verifyUser, verifySignUpToken
} from '../service-configurations/sign-up'
import {ALLOWED_USER_ROLE} from '../domain/entities/users/index'

import { successReponse } from '../helper/http-response'
import AppError from '../utils/response-error'
/**
 * Returns jwt token if registration was successful
 * @public
 */
export const verifyTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let redisPublisher = req.app.get('redisPublisher')
    const {token = ''} = <any>req.query
    const newUser = await verifySignUpToken(redisPublisher)
      .verifyOne(token)
    res.locals.signUpVerifiedTokenResponse = newUser
    next()
  } catch (error) {
    next(new AppError({
      message: error.message,
      httpStatus: httpStatus.BAD_REQUEST
    }))
  }
};

/**
 * Returns jwt token if registration was successful
 * @public
 */
export const signUpRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let redisPublisher = req.app.get('redisPublisher')
    const newUser = await userSignUp(redisPublisher)
      .createOne({
        ...req.body,
        role: ALLOWED_USER_ROLE.USER
      })
    //@ts-ignore
    delete newUser.password
    res.status(httpStatus.CREATED).json(successReponse(newUser))
  } catch (error) {
    next(new AppError({
      message: error.message,
      httpStatus: httpStatus.BAD_REQUEST
    }));
  }
};
/**
 * Returns jwt token if registration was successful
 * @public
 */
export const verifyUserRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let redisPublisher = req.app.get('redisPublisher')
    const {_id: userId} = res.locals.signUpVerifiedTokenResponse
    const newUser = await verifyUser(redisPublisher)
      .updateOne(userId)
    //@ts-ignore
    delete newUser.password
    res.status(httpStatus.OK).json(successReponse(newUser))
  } catch (error) {
    next(new AppError({
      message: error.message,
      httpStatus: httpStatus.BAD_REQUEST
    }));
  }
};
/**
 * Returns jwt token if registration was successful
 * @public
 */
export const verifyTokenRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(httpStatus.OK).json(successReponse(res.locals.signUpVerifiedTokenResponse))
  } catch (error) {
    next(new AppError({
      message: error.message,
      httpStatus: httpStatus.BAD_REQUEST
    }))
  }
};