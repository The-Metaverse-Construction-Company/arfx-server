
/**
 * @env_variables
 */
import { CLIENT_HOST } from '../../../../config/vars'
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
export class SendEmailVerificationService {
  constructor (protected deps: IDependencies) {
  }
  /**
   * send email verification for account who haven't verified yet.
   * @param userId 
   * @param token 
   */
  public sendOne = async (userId: string, token: string) => {
    try {
      console.log('Sending email verification....');
      // insert to repository.
      const user = await this.deps.repositoryGateway.findOne({_id: userId})
      // if the email is already verified, then skip sending email.
      if (user && !user.email.verified) {
        await this.deps.sendEmail({
          name: user.name,
          token,
          email: user.email.value,
          url: `${CLIENT_HOST}/ui/verification?token=${token}&tokenType=${TOKEN_TYPE.SIGN_UP}`
        })
      }
      console.log('Successfully send email verification!');
      //add some logs
      return true
    } catch (error) {
      console.log('error :>> ', error);
      throw error
    }
  }
}