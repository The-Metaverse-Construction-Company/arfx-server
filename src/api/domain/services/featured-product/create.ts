/**
 * @entity_featured_product_interfaces
 */
import {
  IFeaturedProductParams,
  IFeaturedProductRepositoryGateway
} from '../../entities/featured-product'
/**
 * @entity_featured_product
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
export class CreateFeaturedProductService {
  constructor (protected deps: IServiceDependencies) {
  }
  /**
   * create new featured product.
   * @param data 
   */
  public createOne = async (data: IFeaturedProductParams) => {
    try {
      const {
        active = true,
        adminAccountId = '',
        indexNo = 0,
        productId = ''
      } = data
      // initialize featured product entity.
      const newFeaturedProduct = new FeaturedProductEntity({
        active,
        adminAccountId,
        productId,
        indexNo
      })
      // insert product banner on the repository
      const featuredProduct = await this.deps.repositoryGateway.insertOne(newFeaturedProduct)
      //add some logs
      return newFeaturedProduct
    } catch (error) {
      console.log('failed to create product banner. \nError:>> ', error);
      throw error
    }
  }
}