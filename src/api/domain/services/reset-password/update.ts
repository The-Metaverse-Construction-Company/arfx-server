import { TOKEN_TYPE } from '../../../utils/constants'
import {
  UserEntity
} from '../../entities'
import { IRevokeToken } from '../../interfaces'
import {UserDetails} from '../users'
import {
  IGeneralServiceDependencies
} from '../../interfaces'
import { IUserRepositoryGateway } from '../../entities/users'
interface IServiceDependencies extends IGeneralServiceDependencies<IUserRepositoryGateway>{
  userDetails: UserDetails
  revokeToken: IRevokeToken
}
export default class UserVerifyResetPassword {
  constructor (protected deps: IServiceDependencies) {
  }
  public updateOne = async (userId: string, newPassword: string) => {
    try {
      // fetch user by email.
      const user = await this.deps.userDetails.findOne(userId, {password: 0})
      // create user entity instance to run the business rules validations. and also to hash the password.
      const newUser = new UserEntity({
        ...JSON.parse(JSON.stringify(user)),
        password: newPassword
      })
      user.password = newUser.password;
      user.updatedAt = newUser.updatedAt;
      const updatedUser = await this.deps.repositoryGateway.updateOne({
        _id: user._id,
      }, {
        password: newUser.password,
        updatedAt: newUser.updatedAt
      })
      // revoke the token to make it invalid or expired.
      await this.deps.revokeToken(userId, TOKEN_TYPE.RESET_PASSWORD)
      // add some logs or notifications
      return user
    } catch (error) {
      console.log('Failed to verify reset password token. \nError: ', error.message);
      throw error
    }
  }
}