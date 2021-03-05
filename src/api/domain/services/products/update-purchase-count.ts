/**
 * @entity_interfaces
 */
import {
  IProductRepositoryGateway
} from '../../entities/product'
/**
 * @general_interfaces
 */
import { IGeneralServiceDependencies } from '../../interfaces';
/**
 * @services
 */
import {
  ProductDetailService
} from './details'
interface IDependencies extends IGeneralServiceDependencies<IProductRepositoryGateway> {
  productDetailService: ProductDetailService
}
export class UpdateProductPurchaseCountService {
  constructor(protected dependencies: IDependencies) {
  }
  /**
   * update the total purchase count of the service
   * 
   * @param productBody 
   */
  public updateOne = async (productId: string) => {
    try {
      // check the product first if existing.
      const product = await this.dependencies.productDetailService.findOne(productId)
      // then increment the purchaseCount
      product.purchaseCount +=1
      const updateProduct = await this.dependencies.repositoryGateway.updateOne({
        _id: productId
      }, {
        purchaseCount: product.purchaseCount
      })
      // add logs here
      return updateProduct
    } catch (error) {
      console.log('failed to update purchase count of the product. \nError :>> ', error);
      throw error
    }
  }
}