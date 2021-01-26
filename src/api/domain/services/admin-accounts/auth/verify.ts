import { IVerifyToken } from '../../../interfaces'
import {AdminAccountDetailsService} from '../index'
import {
  ADMIN_ACCOUNT_TOKEN_TYPES
} from '../../../entities/admin-accounts'
interface Deps {
  verifyToken: IVerifyToken
  adminAccountDetails: AdminAccountDetailsService
}
export class AdminAccountVerifyAuthTokenService {
  constructor (protected deps: Deps) {
  }
  /**
   * verify user token
   * @param token token of the users that do the action.
   * @param tokenType SIGN_IN|RESET_PASSWORD
   */
  public verifyOne = async (token: string, tokenType: ADMIN_ACCOUNT_TOKEN_TYPES) => {
    try {
      const {referenceId} = await this.deps.verifyToken(token, tokenType)
      // fetch user by email.
      const adminAccount = this.deps.adminAccountDetails.getOne(referenceId)
      return adminAccount
    } catch (error) {
      console.log('Failed to verify user token. \nError: ', error.message);
      throw error
    }
  }
}