
import { CLIENT_HOST, TOKEN_TYPE } from '../../../utils/constants'
import {
  IUserEntity,
  IUserRepositoryGateway
} from '../../entities/users/index'
import {
  IGeneralServiceDependencies
} from '../../interfaces'
interface IDependencies extends IGeneralServiceDependencies<IUserRepositoryGateway> {
  sendEmail(data: {name: string, token: string, email: string, url: string}): Promise<any>
}
export class SendEmailVerificationService {
  constructor (protected deps: IDependencies) {
  }
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