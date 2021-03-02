/**
 * @entity_interfaces
 */
import {
  IFeaturedProductRepositoryGateway
} from '../../entities/featured-product'
/**
 * @general_interfaces
 */
import {
  IGeneralServiceDependencies
} from '../../interfaces'
interface IServiceDependencies extends IGeneralServiceDependencies<IFeaturedProductRepositoryGateway>{
}
export class RemoveFeaturedProductService {
  constructor (protected deps: IServiceDependencies) {
  }
  /**
   * remove the specific featured product.
   * @param featuredProductId
   */
  public removeOne = async (featuredProductId: string) => {
    try {
      // remove the product banner on the repository.
      const removedFeaturedProduct = await this.deps.repositoryGateway.removeOne({
        _id: featuredProductId
      })
      if (!removedFeaturedProduct) {
        throw new Error('No featured product found.')
      } 
      //add some logs
      return removedFeaturedProduct
    } catch (error) {
      console.log('failed to remove product banner. \nError:>> ', error);
      throw error
    }
  }
}