import { TOKEN_TYPE } from '../../../utils/constants'
import { IRevokeToken } from '../../interfaces'
interface Deps {
  revokeToken: IRevokeToken
}
export class UserSignOutService {
  constructor (protected deps: Deps) {
  }
  public signOut = async (userId: string) => {
    try {
      await this.deps.revokeToken(userId, TOKEN_TYPE.SIGN_IN)
      // add some logs or notification.
      return true
    } catch (error) {
      console.log('Failed to sign-out user. \nError: ', error);
      throw error
    }
  }
}