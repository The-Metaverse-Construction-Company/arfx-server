import {IUserEntity, IUserRepositoryGateway} from '../../entities/users'
import {
  IGeneralServiceDependencies
} from '../../interfaces'
interface IServiceDependencies extends IGeneralServiceDependencies<IUserRepositoryGateway>{}
export class UserDetailsService {
  constructor (protected dependencies: IServiceDependencies) {
  }
  public findOne = async (userId: string, projection: Partial<Record<keyof IUserEntity, 1|0>> = {}) => {
    try {
      // initiate user entity to run the validation for business rules.
      const user = await this.dependencies.repositoryGateway.findOne({
        _id: userId,
      }, projection)
      if (!user) {
        throw new Error('No User found.')
      }
      return user
    } catch (error) {
      throw error
    }
  }
}