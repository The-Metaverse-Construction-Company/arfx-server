/**
 * @user_entity_interfaces
 */
import {IUserEntity, IUserRepositoryGateway} from '../../entities/users'
/**
 * @general_interfaces
 */
import {
  IGeneralServiceDependencies
} from '../../interfaces'
interface IServiceDependencies extends IGeneralServiceDependencies<IUserRepositoryGateway>{}
export class UserDetailsService {
  constructor (protected dependencies: IServiceDependencies) {
  }
  /**
   * get user details by userId
   * @param userId 
   * @param projection 
   */
  public findOne = async (userId: string, projection: Partial<Record<keyof IUserEntity, 1|0>> = {}) => {
    try {
      const user = await this.dependencies.repositoryGateway.findOne({
        _id: userId,
      }, {
        ...projection,
        password: 0
      })
      if (!user) {
        throw new Error('No User found.')
      }
      return user
    } catch (error) {
      throw error
    }
  }
  /**
   * get user details by azureAd
   * @param azureAdUserId 
   * @param projection 
   */
  public findByAzureAdUserId = async (azureAdUserId: string, projection: Partial<Record<keyof IUserEntity, 1|0>> = {}) => {
    try {
      const user = await this.dependencies.repositoryGateway.findOne({
        //@ts-expect-error
        'service.azureAd': azureAdUserId,
      }, {
        ...projection,
        password: 0
      })
      if (!user) {
        throw new Error('No User found.')
      }
      return user
    } catch (error) {
      throw error
    }
  }
}