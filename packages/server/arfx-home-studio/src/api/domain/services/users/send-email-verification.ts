
import UserModel from '../../../models/user.model'
import {
  IUserEntity
} from '../../entities/users/index'
import {
  IGeneralServiceDependencies
} from '../../interfaces'
interface IDependencies extends IGeneralServiceDependencies<IUserEntity> {
  sendEmail(data: {name: string, token: string, email: string}): Promise<any>
}
export default class SendEmailVerification {
  constructor (protected deps: IDependencies) {
  }
  sendOne = async ({
    userId = '',
    email = '',
    name = '',
    token = ''
  }) => {
    try {
      // initiate user entity to run the validation for business rules.
      // insert to repository.
      const user = await UserModel.findOne({_id: userId})
      // if the email is already verified, then skip sending email.
      if (user && !user.email.verified) {
        this.deps.sendEmail({
          name,
          token,
          email
        })
      }
      //add some logs
      return true
    } catch (error) {
      console.log('error :>> ', error);
      throw error
    }
  }
}