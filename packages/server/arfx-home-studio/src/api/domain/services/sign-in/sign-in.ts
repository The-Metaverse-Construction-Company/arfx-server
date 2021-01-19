import {
  UserEntity
} from '../../entities'
import UserModel from '../../../models/user.model'
interface Deps {
  generateToken(payload: {referenceId: string}): Promise<string>
  comparePassword(password: string, hashPassword: string): boolean
}
export default class UserSignIn {
  constructor (protected deps: Deps) {
  }
  signIn = async ({
    username = '',
    password = '',
  }) => {
    try {
      // initiate user entity to run the validation for business rules.
      const user = await UserModel.findOne({
        "email.value": username
      })
      .sort({
        createdAt: 1
      })
      if (!user || !(this.deps.comparePassword(password, user.password))) {
        throw new Error('Invalid credentials.')
      } else if (!user.email.verified) {
        throw new Error('Account not yet verified, Please verified your account first.')
      }
      const token = await this.deps.generateToken({
        referenceId: user._id,
      })
      // add some logs or notification.
      return {
        user: user,
        token
      }
    } catch (error) {
      console.log('error :>> ', error);
      throw error
    }
  }
}