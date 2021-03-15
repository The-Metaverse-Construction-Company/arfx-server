/**
 * @entity_interfaces
 */
import {
  IProductListFilterQuery,
  IProductRepositoryGateway
} from '../../entities/product'
/**
 * @general_interfaces
 */
import { IGeneralServiceDependencies } from '../../interfaces';
interface IDependencies extends IGeneralServiceDependencies<IProductRepositoryGateway> {}
export class ProductListService {
  constructor(protected dependencies: IDependencies) {
  }
  /**
   * get product lists
   * @param queryParams 
   */
  public getList = async (queryParams?: IProductListFilterQuery) => {
    try {
      // get list in the repo
      const productList = await this.dependencies
        .repositoryGateway
        .getPaginationList(queryParams.userId, queryParams)
      return productList
    } catch (error) {
      console.log('failed to get product list. \nError :>> ', error);
      throw error
    }
  }
}