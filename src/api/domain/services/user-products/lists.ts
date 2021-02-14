import {
  IUserProductsRepositoryGateway,
} from '../../entities/user-products'
import { IGeneralServiceDependencies } from '../../interfaces';
import { IPaginationParameters } from '../../interfaces/general-repository-gateway';
interface IDependencies extends IGeneralServiceDependencies<IUserProductsRepositoryGateway> {}
export class UserProductsListService {
  constructor(protected dependencies: IDependencies) {
  }
  /**
   * get user products/scene list
   * @param productBody 
   */
  public getList = async (userId: string, query: IPaginationParameters) => {
    try {
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