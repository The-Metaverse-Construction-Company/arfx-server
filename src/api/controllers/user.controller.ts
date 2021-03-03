import httpStatus from 'http-status'
import {
  Request, Response, NextFunction,
} from 'express'
import {
  userListService,
  userDetails,
  sendUserOTPService,
  updateUserService,
  createUserService,
  updateUserSuspendStatusService
} from '../service-configurations/users'

import {ALLOWED_USER_ROLE} from '../domain/entities/users/index'
import { TOKEN_TYPE } from '../utils/constants'
import { errorResponse, successReponse } from '../helper/http-response'
import AppError from '../utils/response-error'

/**
 * @public
 * Load user and append to req.
 * @requestParams
 *  @field -> userId: string
 */
export const UserDetailsMiddleware = async (req: Request, res: Response, next: NextFunction, id: string) => {
  try {
    const user = await userDetails()
      .findOne(id);
    res.locals['user'] = user
    next()
    return;
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST)
        .send(errorResponse([error.message]))
  }
};

/**
 * @public
 * Get customer/user detail based on the requestParams.userId
 */
export const UserDetailsRoute = (req: Request, res: Response) => {
  res.status(httpStatus.OK)
     .send(successReponse(res.locals['user']))
}

/**
 * @public
 * create user/customer account.
 * @requestBody
 *  @field -> name: string
 *  @field -> email: string
 *  @field -> mobileNumber: string
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
    res.
      status(httpStatus.CREATED).
      send(successReponse(newUser));
  } catch (error) {
    res.
      status(httpStatus.BAD_REQUEST).
      send(errorResponse([error.message]));
  }
};

/**
 * @public
 * Update selected user/customer account.
 * @requestParams
 *  @field -> userId: string
 * @requestBody
 *  @field -> name: string
 *  @field -> email: string
 *  @field -> role: string
 *  @field -> mobileNumber: string
 */
export const UpdateUserRoute = (req: Request, res: Response, next: NextFunction) => {
  const {userId = ''} = req.params
  updateUserService()
    .updateOne(userId, req.body)
    .then((user) => {
      res.status(httpStatus.ACCEPTED)
        .send(successReponse(user))
    })
    .catch((e) => {
      next(new AppError({
        message: e.message,
        httpStatus: httpStatus.BAD_REQUEST
      }))
    });
};


/**
 * @public
 * resend sign-in otp for user/customer who didn't received the otp via sms or email.
 * @requestQuery
 *  @field -> searchText: string
 *  @field -> pageNo: number // page number of pagination list
 *  @field -> limit: number // limit of the list.
 */
export const UserListRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userListService()
      .getList({
        ...req.query,
      })
    res.json(successReponse(users));
  } catch (error) {
    next(new AppError({
      message: error.message,
      httpStatus: httpStatus.BAD_REQUEST
    }))
  }
};

/**
 * @public
 * update suspend status of the user/customer account
 * @requestParam
 *  @field -> userId: string
 */
export const SuspendUserRoute = (req: Request, res: Response, next: NextFunction) => {
  // const { user } = req.locals;
  const {userId = ''} = req.params
  updateUserSuspendStatusService()
    .updateOne(userId, true)
    .then((user) => res.status(httpStatus.ACCEPTED).json(successReponse(user)))
    .catch((e: Error) => {
      next(new AppError({
        message: e.message,
        httpStatus: httpStatus.BAD_REQUEST
      }))
    });
};
/**
 * @public
 * update un-suspend status of the user/customer account
 * @requestParam
 *  @field -> userId: string
 */
export const UnsuspendUserRoute = (req: Request, res: Response, next: NextFunction) => {
  // const { user } = req.locals;
  const {userId = ''} = req.params
  updateUserSuspendStatusService()
    .updateOne(userId, false)
    .then((user) => res.status(httpStatus.ACCEPTED)
      .json(successReponse(user)))
    .catch((e: Error) => {
      next(new AppError({
        message: e.message,
        httpStatus: httpStatus.BAD_REQUEST
      }))
    });
};
/**
 * @public
 * resend sign-in otp for user/customer who didn't received the otp via sms or email.
 * @requestParam
 *  @field -> userId: string
 */
export const resendAccountVerificationOTPRoute = (req: Request, res: Response, next: NextFunction) => {
  const {userId} = req.params
  const redis = req.app.get('redisPublisher')
  sendUserOTPService(redis)
    .sendOne(userId, TOKEN_TYPE.SIGN_UP)
    .then((otp) => {
      res.status(httpStatus.OK).send(successReponse({code: otp}))
    })
    .catch((e: Error) => {
      next(new AppError({
        message: e.message,
        httpStatus: httpStatus.BAD_REQUEST
      }))
    });
};
