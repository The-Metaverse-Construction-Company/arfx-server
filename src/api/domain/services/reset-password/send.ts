import { TOKEN_TYPE } from '../../../utils/constants'
import { IGenerateToken } from '../../interfaces'
import {
  IGeneralServiceDependencies
} from '../../interfaces'
import { IUserRepositoryGateway } from '../../entities/users'
interface IServiceDependencies extends IGeneralServiceDependencies<IUserRepositoryGateway>{
  generateToken: IGenerateToken
  sendEmail(userId: string, token: string): Promise<any>
}
export class UserResetPasswordService {
  constructor (protected deps: IServiceDependencies) {
  }
  public resetOne = async (email: string) => {
    try {
      // fetch user by email.
      const user = await this.deps.repositoryGateway.findOne({
        //@ts-expect-error
        "email.value": email
      }, {password: 0})
      if (!user) {
        // just return false if no user.
        return false
      } 
      // insert to repository.
      const token = await this.deps.generateToken({
        referenceId: user._id,
        tokenType: TOKEN_TYPE.RESET_PASSWORD
      })
      // send forgot password email.
      await this.deps.sendEmail(user._id, token)
      //add some logs
      return token
    } catch (error) {
      console.log('failed to send reset password. \nError:>> ', error);
      throw error
    }
  }
}