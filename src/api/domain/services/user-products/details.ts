import {
  IUserProductsRepositoryGateway,
} from '../../entities/user-products'
import { IGeneralServiceDependencies } from '../../interfaces';
interface IDependencies extends IGeneralServiceDependencies<IUserProductsRepositoryGateway> {}
export class UserProductDetailsService {
  constructor(protected dependencies: IDependencies) {
  }
  /**
   * get user product detail by id
   * @param userProductId 
   */
  public getOne = async (userId: string, userProductId: string) => {
    try {
      const userProductList = await this.dependencies.repositoryGateway.findOne({
        _id: userProductId
      })
      // add some logs here.
      return userProductList
    } catch (error) {
      console.log('failed to create user product. \nError :>> ', error);
      throw error
    }
  }
}