import {
  UserEntity
} from '../../entities'
import UserModel from '../../../models/user.model'
interface Deps {
  verifyToken(token: string): {referenceId: string}
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
      if (user && !user.email.verified) {

      }
      // **DEVNOTE**
      // can add error here if the user is not existed or already verified.
      //add some logs
      return user
    } catch (error) {
      console.log('error :>> ', error);
      throw error
    }
  }
}