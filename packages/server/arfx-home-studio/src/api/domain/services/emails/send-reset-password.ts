
import UserModel from '../../../models/user.model'
import { CLIENT_HOST, TOKEN_TYPE } from '../../../utils/constants'
import {
  IUserEntity
} from '../../entities/users/index'
import {
  IGeneralServiceDependencies
} from '../../interfaces'
interface IDependencies extends IGeneralServiceDependencies<IUserEntity> {
  sendEmail(data: {name: string, token: string, email: string, url: string}): Promise<any>
}
export default class SendResetPassword {
  constructor (protected deps: IDependencies) {
  }
  sendOne = async (userId: string, token: string) => {
    try {
      // initiate user entity to run the validation for business rules.
      // insert to repository.
      const user = await UserModel.findOne({_id: userId})
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