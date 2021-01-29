import { TOKEN_TYPE } from '../../../utils/constants'
import {
  UserEntity
} from '../../entities'
import { IRevokeToken } from '../../interfaces'
import {UserDetailsService} from '../users'
import {
  IGeneralServiceDependencies
} from '../../interfaces'
import { IUserRepositoryGateway } from '../../entities/users'
interface IServiceDependencies extends IGeneralServiceDependencies<IUserRepositoryGateway>{
  userDetails: UserDetailsService
  revokeToken: IRevokeToken
}
export class UserVerifyResetPasswordService {
  constructor (protected deps: IServiceDependencies) {
  }
  public updateOne = async (userId: string, newPassword: string, otp: string) => {
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
      console.log('user@@@Id :>> ', userId);
      // revoke the token to make it invalid or expired.
      await this.deps.revokeToken(otp, TOKEN_TYPE.RESET_PASSWORD)
      // add some logs or notifications
      return user
    } catch (error) {
      console.log('Failed to verify reset password token. \nError: ', error.message);
      throw error
    }
  }
}