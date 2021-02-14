import {
  IUserProductsRepositoryGateway,
} from '../../entities/user-products'
import { IGeneralServiceDependencies } from '../../interfaces';
interface IDependencies extends IGeneralServiceDependencies<IUserProductsRepositoryGateway> {}
export class UserProductDetailsService {
  constructor(protected dependencies: IDependencies) {
  }
  /**
   * 
   * @param userId 
   * @param id // can be userProductId productId
   */
  public getOne = async (userId: string, id: string) => {
    try {
      const userProduct = await this.dependencies.repositoryGateway.getOneByUserId(userId, id)
      // add some logs here.
      return userProduct
    } catch (error) {
      console.log('failed to create user product. \nError :>> ', error);
      throw error
    }
  }
}