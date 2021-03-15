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
interface IDependencies extends IGeneralServiceDependencies<IProductRepositoryGateway> {
}
export class FeaturedProductListService {
  constructor(protected dependencies: IDependencies) {
  }
  /**
   * get featured product list
   * @param productBody 
   */
  public getList = async (queryParams?: IProductListFilterQuery) => {
    try {
      // get list in the repo
      let productList = await this.dependencies.repositoryGateway.getFeaturedList({
        ...queryParams,
        limit: 50,
        onFeaturedList: true
      })
      if (productList.length === 0) {
        // get all product instead
        productList = await this.dependencies.repositoryGateway.getFeaturedList({
          ...queryParams,
          limit: 25,
        })
      }
      return {
        // random the sorting of the products
        data: productList.sort(() => 0.5 - Math.random()).splice(0, queryParams.limit)
      }
    } catch (error) {
      console.log('failed to get featured product list. \nError :>> ', error);
      throw error
    }
  }
}