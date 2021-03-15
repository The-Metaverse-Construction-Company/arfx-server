/**
 * @constant
 */
import { TOKEN_TYPE } from '../../../utils/constants'
/**
 * @user_entity
 */
import {UserVerifyTokenService} from '../users'

interface IServiceDependencies {
  verifyUserToken: UserVerifyTokenService
}
export class VerifyUserTokenService {
  constructor (protected deps: IServiceDependencies) {
  }
  /**
   * verify the sign-up token/otp of the user/customer
   * @param token 
   */
  public verifyOne = async (token: string) => {
    try {
      //verify the sign-up token/otp
      const user = await this.deps.verifyUserToken.verifyOne(token, TOKEN_TYPE.SIGN_UP)
      if (user.email.verified) {
        throw new Error('User already verified.')
      }
      return user
    } catch (error) {
      throw error
    }
  }
}