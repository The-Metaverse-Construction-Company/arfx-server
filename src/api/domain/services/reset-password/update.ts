/**
 * @constant
 */
import { TOKEN_TYPE } from '../../../utils/constants'
/**
 * @general_interfaces
 */
import { IRevokeToken } from '../../interfaces'
/**
 * @services
 */
import {
  UpdateUserPasswordService
} from '../users'
interface IServiceDependencies {
  updateUserPasswordService: UpdateUserPasswordService
  revokeToken: IRevokeToken
}
export class UserVerifyResetPasswordService {
  constructor (protected deps: IServiceDependencies) {
  }
  /**
   * validate reset password.
   * @param userId
   * @param newPassword
   * @param otp
   */
  public updateOne = async (userId: string, newPassword: string, otp: string) => {
    try {
      // update user password
      const user = await this.deps.updateUserPasswordService.updateOne(userId, newPassword)
      // revoke the token to make it invalid or expired.
      await this.deps.revokeToken(otp, TOKEN_TYPE.RESET_PASSWORD)
      // add some logs or notifications
      return user
    } catch (error) {
      console.log('Failed to verify reset password token. \nError: ', error.message);
      throw error
    }
  }
}