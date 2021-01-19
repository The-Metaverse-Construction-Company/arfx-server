import {
  UserEntity
} from '../../entities'
import UserModel from '../../../models/user.model'
interface Deps {
  verifyToken(token: string): Promise<{referenceId: string}>
}
export default class VerifyUser {
  constructor (protected deps: Deps) {
  }
  verifyOne = async (token: string) => {
    try {
      // initiate user entity to run the validation for business rules.
      const {referenceId = ''} = await this.deps.verifyToken(token)
      const user = await UserModel.findOne({
        _id: referenceId,
      })
      if (!user) {
        throw new Error('No User found.')
      } else if (user.email.verified) {
        throw new Error('User already verified.')
      }
      user.email.verified = true
      user.email.verifiedAt = Date.now()
      user.save()
      // **DEVNOTE**
      // can add error here if the user is not existed or already verified.
      //add some logs
      return user
    } catch (error) {
      throw error
    }
  }
}