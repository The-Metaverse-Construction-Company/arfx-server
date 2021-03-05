/**
 * @entity_interfaces
 */
import {
  IFeaturedProductParams,
  IFeaturedProductRepositoryGateway
} from '../../entities/featured-product'
/**
 * @entity
 */
import {
  FeaturedProductEntity
} from '../../entities'
/**
 * @general_interfaces
 */
import {
  IGeneralServiceDependencies
} from '../../interfaces'
interface IServiceDependencies extends IGeneralServiceDependencies<IFeaturedProductRepositoryGateway>{
}
export class UpdateFeaturedProductService {
  constructor (protected deps: IServiceDependencies) {
  }
  /**
   * update single featured product.
   * @param bannerId 
   * @param data 
   */
  public updateOne = async (bannerId: string, data: IFeaturedProductParams) => {
    try {
      const {
        active = true,
        adminAccountId = '',
        productId = '',
        indexNo
      } = data
      const featuredProduct = new FeaturedProductEntity({
        _id: bannerId,
        active,
        adminAccountId,
        productId,
        indexNo
      })
      // insert product banner on the repository
      const updatedFeaturedProduct = await this.deps.repositoryGateway.updateOne({
        _id: featuredProduct._id
      },
        {
          active: featuredProduct.active,
          productId: featuredProduct.productId,
          indexNo: featuredProduct.indexNo
        })
      //add some logs
      return featuredProduct
    } catch (error) {
      console.log('failed to update product banner. \nError:>> ', error);
      throw error
    }
  }
}