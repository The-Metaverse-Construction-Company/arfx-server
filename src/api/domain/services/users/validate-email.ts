import httpStatus from 'http-status'
/**
 * @api_error
 */
import APIError from '../../../utils/APIError'
/**
 * @user_entity_interfaces
 */
import {
  IUserRepositoryGateway
} from '../../entities/users'
/**
 * @general_interfaces
 */
import {
  IGeneralServiceDependencies
} from '../../interfaces'
interface IOptions {
  userId?: string
}
interface IServiceDependencies extends IGeneralServiceDependencies<IUserRepositoryGateway>{}
export class ValidateDuplicateEmailService {
  constructor (protected dependencies: IServiceDependencies) {
  }
  /**
   * validate user/customer email if already exists on the user repository
   * @param param0 
   */
  public validateOne = async (email: string, option: IOptions = {}) => {
    try {
      const {
        userId = ''
      } = option
      // initiate user entity
      // add catch to handle the built in error on the findOne when no details found.
      const user = await this.dependencies.repositoryGateway.validateEmail(email, {
        userId
      })
      if (user) {
        throw new Error('"email" already exists to our repository.')
      }
      //add some logs
      return true
    } catch (error) {
      throw error
    }
  }
}