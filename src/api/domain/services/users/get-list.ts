/**
 * @user_interfaces
 */
import {
  IUserRepositoryGateway
} from '../../entities/users'
/**
 * @general_repository_interfaces
 */
import { IPaginationParameters } from '../../interfaces/general-repository-gateway'
/**
 * @general_interfaces
 */
import {
  IGeneralServiceDependencies
} from '../../interfaces'
interface IServiceDependencies extends IGeneralServiceDependencies<IUserRepositoryGateway>{}
export class UserListService {
  constructor (protected dependencies: IServiceDependencies) {
  }
  /**
   * user product list
   * @param filterQuery 
   */
  public getList = async (filterQuery: Partial<IPaginationParameters>) => {
    try {
      // get pagination list of the user
      const response = await this.dependencies.repositoryGateway.paginationList(filterQuery)
      return response
    } catch (error) {
      console.log('error :>> ', error);
      throw error
    }
  }
}