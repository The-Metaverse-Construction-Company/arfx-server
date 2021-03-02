import { TOKEN_TYPE } from '../../../utils/constants'
import { IRevokeToken } from '../../interfaces'
interface Deps {
  revokeToken: IRevokeToken
}
export class UserSignOutService {
  constructor (protected deps: Deps) {
  }
  /**
   * sign-out the user/customer
   * @param userId
   */
  public signOut = async (userId: string) => {
    try {
      // revoke or remove the sign-in token.
      await this.deps.revokeToken(userId, TOKEN_TYPE.SIGN_IN)
      // add some logs or notification.
      return true
    } catch (error) {
      console.log('Failed to sign-out user. \nError: ', error);
      throw error
    }
  }
}