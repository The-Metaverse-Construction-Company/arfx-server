import httpStatus from 'http-status'
import express, {
  Response, Request, NextFunction
} from 'express'
import moment from 'moment-timezone'

import {
  sendResetPassword,
  updateResetPassword,
} from '../service-configurations/reset-password'
import {
  verifyUserToken,
} from '../service-configurations/users'

import {
  successReponse
} from '../helper/http-response'
import { TOKEN_TYPE } from '../utils/constants'


export const verifyResetPasswordMiddleWare = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token = '', tokenType = '' } = <any>req.query;
    const redisPublish = req.app.get('redisPublisher')
    const response = await verifyUserToken(redisPublish)
      .verifyOne(token, TOKEN_TYPE.RESET_PASSWORD)
    res.locals.resetPasswordData = response
    next()
  } catch (error) {
    return next(error);
  }
};
export const sendResetPasswordRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    const redisPublish = req.app.get('redisPublisher')
    const response = await sendResetPassword(redisPublish).resetOne(email)
    res.status(httpStatus.OK).json(successReponse(response));
  } catch (error) {
    return next(error);
  }
};
export const verifyResetPasswordRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(httpStatus.OK).json(successReponse(res.locals.resetPasswordData));
  } catch (error) {
    return next(error);
  }
};

export const updateResetPasswordRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const {_id: userId} = res.locals.resetPasswordData
    const redisPublish = req.app.get('redisPublisher')
    const response = await updateResetPassword(redisPublish)
      .updateOne(userId, password)
    res.status(httpStatus.OK).json(successReponse(response));
  } catch (error) {
    return next(error);
  }
};
