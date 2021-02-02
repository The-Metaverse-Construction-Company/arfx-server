import { TOKEN_TYPE } from '../../../utils/constants'
import {UserVerifyTokenService} from '../users'

interface Deps {
  verifyUserToken: UserVerifyTokenService
}
export class VerifyUserTokenService {
  constructor (protected deps: Deps) {
  }
  verifyOne = async (token: string) => {
    try {
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