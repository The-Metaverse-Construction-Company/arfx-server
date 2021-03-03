/**
 * @general_interfaces
 */
import {
  IGeneralServiceDependencies
} from '../../interfaces'
/**
 * @user_entity
 */
import { IUserRepositoryGateway } from '../../entities/users'
interface IServiceDependencies extends IGeneralServiceDependencies<IUserRepositoryGateway>{
  // generateToken: IGenerateToken
  comparePassword(password: string, hashPassword: string): boolean
}
export class ValidateUserPasswordService {
  constructor (protected deps: IServiceDependencies) {
  }
  /**
   * validate user/customer password
   * @param userId 
   * @param password 
   */
  public validateOne = async (userId: string, password: string) => {
    try {
      // initiate user entity to run the validation for business rules.
      const user = await this.deps.repositoryGateway.findOne({
        _id: userId
      })
      // compare password.
      if (!user || !(this.deps.comparePassword(password, user.password))) {
        throw new Error('Invalid user credentials.')
      }
      // removing password field on responsing user data
      //@ts-ignore
      delete user.password
      // add some logs or notification.
      return user
    } catch (error) {
      console.log('failed to validate user password. \nError: ', error);
      throw error
    }
  }
}