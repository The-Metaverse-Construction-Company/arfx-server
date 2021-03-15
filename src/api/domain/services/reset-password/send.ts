/**
 * @constant
 */
import { TOKEN_TYPE } from '../../../utils/constants'
/**
 * @general_interfaces
 */
import { IGenerateToken, IGeneralServiceDependencies } from '../../interfaces'
/**
 * @entity_interfaces
 */
import { IUserRepositoryGateway } from '../../entities/users'
interface IServiceDependencies extends IGeneralServiceDependencies<IUserRepositoryGateway>{
  generateToken: IGenerateToken
  sendEmail(userId: string, token: string): Promise<any>
}
export class UserResetPasswordService {
  constructor (protected deps: IServiceDependencies) {
  }
  /**
   * send a reset password email.
   * @param email 
   */
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
      // generate token
      const token = await this.deps.generateToken({
        referenceId: user._id,
        tokenType: TOKEN_TYPE.RESET_PASSWORD
      })
      // send reset password email.
      await this.deps.sendEmail(user._id, token)
      //add some logs
      return token
    } catch (error) {
      console.log('failed to send reset password. \nError:>> ', error);
      throw error
    }
  }
}