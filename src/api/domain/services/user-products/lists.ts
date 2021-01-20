import {
  IUserProductsRepositoryGateway,
} from '../../entities/user-products'
import { IGeneralServiceDependencies } from '../../interfaces';
interface IDependencies extends IGeneralServiceDependencies<IUserProductsRepositoryGateway> {}
export class UserProductsListService {
  constructor(protected dependencies: IDependencies) {
  }
  /**
   * get user products/scene list
   * @param productBody 
   */
  public getList = async (userId: string, query: any) => {
    try {
      const userProductList = await this.dependencies.repositoryGateway.findAll({
        userId
      })
      // add some logs here.
      return userProductList
    } catch (error) {
      console.log('failed to create user product. \nError :>> ', error);
      throw error
    }
  }
}