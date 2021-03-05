/**
 * @entity_interfaces
 */
import {
  IUserProductsRepositoryGateway,
} from '../../entities/user-products'
/**
 * @general_interfaces
 */
import { IGeneralServiceDependencies } from '../../interfaces';
/**
 * @general_repository_interfaces
 */
import { IPaginationParameters } from '../../interfaces/general-repository-gateway';
interface IDependencies extends IGeneralServiceDependencies<IUserProductsRepositoryGateway> {}
export class UserProductsListService {
  constructor(protected dependencies: IDependencies) {
  }
  /**
   * get the user products per userId
   * @param userId 
   * @param query 
   */
  public getList = async (userId: string, query: IPaginationParameters) => {
    try {
      // get the user products on the repository.
      const userProductList = await this.dependencies.repositoryGateway
        .getPaginationList(userId, query)
      // add some logs here.
      return userProductList
    } catch (error) {
      console.log('failed to get user product list. \nError :>> ', error);
      throw error
    }
  }
}