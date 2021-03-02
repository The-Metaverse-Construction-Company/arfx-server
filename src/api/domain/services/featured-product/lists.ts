/**
 * @entity_interfaces
 */
import {
  IFeaturedProductRepositoryGateway, IFeaturedProductsParams
} from '../../entities/featured-product'
/**
 * @general_interfaces
 */
import {
  IGeneralServiceDependencies,
} from '../../interfaces'
interface IServiceDependencies extends IGeneralServiceDependencies<IFeaturedProductRepositoryGateway>{
}
export class FeaturedProductListService {
  constructor (protected deps: IServiceDependencies) {
  }
  /**
   * get featured product lists.
   * @param filterQuery 
   */
  public getList = async (filterQuery: IFeaturedProductsParams) => {
    try {
      // remove the product banner on the repository.
      const paginationList = await this.deps.repositoryGateway.getPaginationList(filterQuery)
      //add some logs
      return paginationList
    } catch (error) {
      console.log('failed to remove product banner. \nError:>> ', error);
      throw error
    }
  }
}