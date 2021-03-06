/**
 * @general_interfaces
 */
import { IGenerateToken } from '../../interfaces'
/**
 * @constant
 */
import { TOKEN_TYPE } from '../../../utils/constants'
/**
 * @general_interfaces
 */
import {
  IGeneralServiceDependencies
} from '../../interfaces'
/**
 * @user_entity_interfaces
 */
import { IUserRepositoryGateway } from '../../entities/users'
/**
 * @services
 */
import {
  ValidateUserPasswordService
} from '../users'
interface IServiceDependencies extends IGeneralServiceDependencies<IUserRepositoryGateway>{
  generateToken: IGenerateToken
  validateUserPasswordService: ValidateUserPasswordService
  // comparePassword(password: string, hashPassword: string): boolean
}
export class UserSignInService {
  constructor (protected deps: IServiceDependencies) {
  }
  /**
   * sign-in the user/customer
   * @param param0 
   */
  public signIn = async ({
    username = '',
    password = '',
  }) => {
    try {
      // initiate user entity to run the validation for business rules.
      const user = await this.deps.repositoryGateway.findOne({
        //@ts-expect-error
        "email.value": username
      }).catch(() => null)
      if (!user) {
        throw new Error('Invalid user credentials.')
      }
      // validate account password
      await this.deps.validateUserPasswordService.validateOne(user._id, password)
      // if pass, then validate email if verified.
      if (!user.email.verified) {
        throw new Error('Account not yet verified, Please verify your account first.')
      }
      // generate auth token
      const token = await this.deps.generateToken({
        referenceId: user._id,
        tokenType: TOKEN_TYPE.SIGN_IN
      }, 60 * 8) // 8 hrs token duration
      // removing password field on responsing user data
      delete user.password
      // add some logs or notification.
      return {
        user: user,
        token
      }
    } catch (error) {
      console.log('error on sign-in user:>> ', error.message);
      throw error
    }
  }
}