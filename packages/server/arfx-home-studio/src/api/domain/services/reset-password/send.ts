import UserModel from '../../../models/user.model'
import { TOKEN_TYPE } from '../../../utils/constants'
import { IGenerateToken } from '../../interfaces'
import findOneById from '../users/find-one-by-id'

interface Deps {
  generateToken: IGenerateToken
  sendEmail(userId: string, token: string): Promise<any>
  findUserDetailsById: ReturnType<typeof findOneById>
}
export default class UserResetPassword {
  constructor (protected deps: Deps) {
  }
  public resetOne = async (email: string) => {
    try {
      // fetch user by email.
      const user = await UserModel.findOne({
        "email.value": email
      })
      if (!user) {
        // just return false if no user.
        return false
      } 
      // insert to repository.
      const token = await this.deps.generateToken({
        referenceId: user._id,
        tokenType: TOKEN_TYPE.RESET_PASSWORD
      })
      // send forgot password email.
      await this.deps.sendEmail(user._id, token)
      //add some logs
      return token
    } catch (error) {
      console.log('failed to send reset password. \nError:>> ', error);
      throw error
    }
  }
}