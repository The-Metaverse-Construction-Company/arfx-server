import {
  IProductListFilterQuery,
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
  public getList = async (queryParams?: IProductListFilterQuery) => {
    try {
      // get list in the repo
      const productList = await this.dependencies.repositoryGateway.getPaginationList(queryParams.userId, queryParams)
      return productList
    } catch (error) {
      console.log('failed to get product list. \nError :>> ', error);
      throw error
    }
  }
}