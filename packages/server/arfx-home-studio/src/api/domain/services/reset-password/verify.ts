import UserModel from '../../../models/user.model'
import { TOKEN_TYPE } from '../../../utils/constants'
import { IVerifyToken } from '../../interfaces'
interface Deps {
  verifyToken: IVerifyToken
}
export default class UserVerifyResetPassword {
  constructor (protected deps: Deps) {
  }
  public verifyOne = async (token: string) => {
    try {
      const {referenceId} = await this.deps.verifyToken(token, TOKEN_TYPE.RESET_PASSWORD)
      // fetch user by email.
      const user = await UserModel.findOne({
        _id: referenceId
      })
      if (!user) {
        // just return false if no user.
        return false
      } 
      return user
    } catch (error) {
      console.log('Failed to verify reset password token. \nError: ', error.message);
      throw error
    }
  }
}