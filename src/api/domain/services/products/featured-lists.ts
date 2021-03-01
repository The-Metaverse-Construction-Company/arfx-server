import {
  IProductListFilterQuery,
  IProductRepositoryGateway
} from '../../entities/product'
import { IGeneralServiceDependencies } from '../../interfaces';
import {
  ProductList
} from './lists'
interface IDependencies extends IGeneralServiceDependencies<IProductRepositoryGateway> {
}
export class FeaturedProductList {
  constructor(protected dependencies: IDependencies) {
  }
  /**
   * create new product.
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
        data: productList.sort(() => 0.5 - Math.random()).splice(0, queryParams.limit)
      }
    } catch (error) {
      console.log('failed to get product list. \nError :>> ', error);
      throw error
    }
  }
}