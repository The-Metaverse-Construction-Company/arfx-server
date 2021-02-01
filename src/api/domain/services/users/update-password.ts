import {
  UserEntity
} from '../../entities'
// import {UserDetailsService} from '../users'
import {
  IGeneralServiceDependencies
} from '../../interfaces'
import { IUserRepositoryGateway } from '../../entities/users'
interface IServiceDependencies extends IGeneralServiceDependencies<IUserRepositoryGateway>{
  // userDetails: UserDetailsService
}
export class UpdateUserPasswordService {
  constructor (protected deps: IServiceDependencies) {
  }
  public updateOne = async (userId: string, newPassword: string) => {
    try {
      // fetch user by email.
      const user = await this.deps.repositoryGateway.findOne({
        _id: userId
      }, {password: 0})
      // create user entity instance to run the business rules validations. and also to hash the password.
      const newUser = new UserEntity({
        ...JSON.parse(JSON.stringify(user)),
        password: newPassword
      })
      await this.deps.repositoryGateway.updateOne({
        _id: user._id,
      }, {
        password: newUser.password,
        updatedAt: newUser.updatedAt
      })
      // add some logs or notifications
      return user
    } catch (error) {
      console.log('Failed to update user password. \nError: ', error.message);
      throw error
    }
  }
}