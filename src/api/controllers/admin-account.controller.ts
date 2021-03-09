/**
 * @libraries
 */
import {
  NextFunction,
  Request,
  Response,
  httpStatus
} from './index.controller'
/**
 * @services
 */
import {
  adminAccountDetailsService,
  adminAccountListService,
  createAdminAccountService,
  updateAdminAccountService
} from '../service-configurations/admin-accounts'
/**
 * @helpers
 */
import { successReponse } from '../helper/http-response'
import AppError from '../utils/response-error';
/**
 * @public
 * create admin account
 * @requestBody
 *  @field -> firstName: string
 *  @field -> lastName: string
 *  @field -> roleLevel: number// 1 - super admin, 2 - admin, 3 - user
 *  @field -> email: string
 *  @field -> password: string
 */
export const createAdminAccountRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newPurchaseHistory = await createAdminAccountService()
      .createOne(req.body)
    res.status(httpStatus.CREATED)
      .json(successReponse(newPurchaseHistory))
  } catch (error) {
    next(new AppError({
      message: error.message,
      httpStatus: httpStatus.BAD_REQUEST
    }))
  }
};
/**
 * @public
 * update admin account
 * @requestParams
 *  @field -> adminAccountId: string
 * @requestBody
 *  @field -> firstName: string
 *  @field -> lastName: string
 *  @field -> roleLevel: number// 1 - super admin, 2 - admin, 3 - user
 *  @field -> email: string
 *  @field -> password: string
 */
export const updateAdminAccountRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {adminAccountId = '' } = req.params
    const updatedAdminAccount = await updateAdminAccountService()
      .updateOne(adminAccountId, req.body)
    res.status(httpStatus.ACCEPTED)
      .json(successReponse(updatedAdminAccount))
  } catch (error) {
    next(new AppError({
      message: error.message,
      httpStatus: httpStatus.BAD_REQUEST
    }))
  }
};
/**
 * @public
 * get admin account details by id
 * @requestPArams
 *  - @field -> adminAccountId: string
 */
export const adminAccountDetailsRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {adminAccountId = '' } = req.params
    // const redisClient = req.app.get('redisPublisher')
    const adminAccount = await adminAccountDetailsService()
      .getOne(adminAccountId)
    res.status(httpStatus.OK)
      .json(successReponse(adminAccount))
  } catch (error) {
    next(new AppError({
      message: error.message,
      httpStatus: httpStatus.BAD_REQUEST
    }))
  }
};
/**
 * @public
 * get admin account lists
 * @requestQuery
 *  - @field -> searchText: string
 *  - @field -> pageNo: number
 *  - @field -> limit: number
 */
export const adminAccountListRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // const redisClient = req.app.get('redisPublisher')
    const adminAccounts = await adminAccountListService()
      .getList(req.query)
    res.status(httpStatus.OK)
      .json(successReponse(adminAccounts))
  } catch (error) {
    next(new AppError({
      message: error.message,
      httpStatus: httpStatus.BAD_REQUEST
    }))
  }
};