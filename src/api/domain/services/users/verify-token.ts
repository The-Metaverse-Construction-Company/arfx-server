import { IVerifyToken } from '../../interfaces'
import {FindOneById} from './index'
interface Deps {
  verifyToken: IVerifyToken
  findUserById: ReturnType<typeof FindOneById>
}
export default class UserVerifyResetPassword {
  constructor (protected deps: Deps) {
  }
  public verifyOne = async (token: string, tokenType: string) => {
    try {
      const {referenceId} = await this.deps.verifyToken(token, tokenType)
      // fetch user by email.
      const user = this.deps.findUserById(referenceId, {password: 0})
      return user
    } catch (error) {
      console.log('Failed to verify reset password token. \nError: ', error.message);
      throw error
    }
  }
}