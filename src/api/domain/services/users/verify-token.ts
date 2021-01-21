import { IVerifyToken } from '../../interfaces'
import {UserDetails} from './index'
interface Deps {
  verifyToken: IVerifyToken
  userDetails: UserDetails
}
export class UserVerifyToken {
  constructor (protected deps: Deps) {
  }
  /**
   * verify user token
   * @param token token of the users that do the action.
   * @param tokenType SIGN_UP|SIGN_IN|RESET_PASSWORD
   */
  public verifyOne = async (token: string, tokenType: string) => {
    try {
      const {referenceId} = await this.deps.verifyToken(token, tokenType)
      // fetch user by email.
      const user = this.deps.userDetails.findOne(referenceId, {password: 0})
      return user
    } catch (error) {
      console.log('Failed to verify user token. \nError: ', error.message);
      throw error
    }
  }
}