import { TOKEN_TYPE } from '../../../utils/constants'
import {
  UserEntity
} from '../../entities'
import { IRevokeToken } from '../../interfaces'
import findOneById from '../users/find-one-by-id'
interface Deps {
  findUserDetailsById: ReturnType<typeof findOneById>
  revokeToken: IRevokeToken
}
export default class UserVerifyResetPassword {
  constructor (protected deps: Deps) {
  }
  public updateOne = async (userId: string, newPassword: string) => {
    try {
      // fetch user by email.
      const user = await this.deps.findUserDetailsById(userId, {password: 0})
      // create user entity instance to run the business rules validations. and also to hash the password.
      const newUser = new UserEntity({
        ...JSON.parse(JSON.stringify(user)),
        password: newPassword
      })
      user.password = newUser.password;
      user.updatedAt = newUser.updatedAt;
      // revoke the token to make it invalid or expired.
      await this.deps.revokeToken(userId, TOKEN_TYPE.RESET_PASSWORD)
      user.save()
      // add some logs or notifications
      return user
    } catch (error) {
      console.log('Failed to verify reset password token. \nError: ', error.message);
      throw error
    }
  }
}