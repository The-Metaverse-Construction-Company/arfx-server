/**
 * @libraries
 */
import {
  NextFunction,
  Request,
  Response,
  httpStatus
} from '../index.controller'
/**
 * @services
 */
import {
  adminAccountSignInService
} from '../../service-configurations/admin-accounts'
/**
 * @helpers
 */
import { successReponse } from '../../helper/http-response'
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
export const signInAdminAccountRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const redisClient = req.app.get('redisPublisher')
    const {username = '', password = ''} = req.body
    const response = await adminAccountSignInService(redisClient)
      .signIn(username, password)
    res.status(httpStatus.CREATED)
      .json(successReponse(response))
  } catch (error) {
    next(error)
  }
};
export const validateAuthTokenRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(httpStatus.OK)
      .json(successReponse({admin: req.user, token: ''}))
  } catch (error) {
    next(error)
  }
};