import {
  UserEntity
} from '../../entities'
import findOneById from '../users/find-one-by-id'
interface Deps {
  findUserDetailsById: ReturnType<typeof findOneById>
}
export default class UserVerifyResetPassword {
  constructor (protected deps: Deps) {
  }
  public updateOne = async (userId: string, newPassword: string) => {
    try {
      // fetch user by email.
      const user = await this.deps.findUserDetailsById(userId)
      // create user entity instance to run the business rules validations. and also to hash the password.
      const newUser = new UserEntity({
        ...JSON.parse(JSON.stringify(user)),
        password: newPassword
      })
      user.password = newUser.password;
      user.updatedAt = newUser.updatedAt;
      // add some logs or notifications
      return user
    } catch (error) {
      console.log('Failed to verify reset password token. \nError: ', error.message);
      throw error
    }
  }
}