/**
 * @env_variables
 */
import { CLIENT_HOST} from '../../../../config/vars'
/**
 * @constant
 */
import { TOKEN_TYPE } from '../../../utils/constants'
/**
 * @user_entity
 */
import {
  IUserRepositoryGateway
} from '../../entities/users/index'
/**
 * @general_entity
 */
import {
  IGeneralServiceDependencies
} from '../../interfaces'
interface IDependencies extends IGeneralServiceDependencies<IUserRepositoryGateway> {
  sendEmail(data: {name: string, token: string, email: string, url: string}): Promise<any>
}
export class SendResetPasswordService {
  constructor (protected deps: IDependencies) {
  }
  /**
   * send reset password email.
   * @param userId 
   * @param token 
   */
  public sendOne = async (userId: string, token: string) => {
    try {
      // initiate user entity to run the validation for business rules.
      // insert to repository.
      const user = await this.deps.repositoryGateway.findOne({_id: userId}).catch(() => null)
      // if the email is already verified, then skip sending email.
      if (user) {
        this.deps.sendEmail({
          name: user.name,
          token,
          email: user.email.value,
          url: `${CLIENT_HOST}/ui/reset-password?token${token}&tokenType=${TOKEN_TYPE.RESET_PASSWORD}`
        })
      }
      //add some logs
      return true
    } catch (error) {
      console.log('Failed to send reset password email. \nError: ', error);
      throw error
    }
  }
}