import {
  IProductRepositoryGateway
} from '../../entities/product'
import { IGeneralServiceDependencies } from '../../interfaces';
interface IDependencies extends IGeneralServiceDependencies<IProductRepositoryGateway> {}
export class ProductList {
  constructor(protected dependencies: IDependencies) {
  }
  /**
   * create new product.
   * @param productBody 
   */
  public getList = async (queryParams?: any) => {
    try {
      // get list in the repo
      const productList = await this.dependencies.repositoryGateway.getPaginationList(queryParams.userId, queryParams)
      return productList
    } catch (error) {
      console.log('failed to create product. \nError :>> ', error);
      throw error
    }
  }
}