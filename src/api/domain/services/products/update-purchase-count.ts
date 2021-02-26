import {
  IProductRepositoryGateway
} from '../../entities/product'
import { IGeneralServiceDependencies } from '../../interfaces';
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
   * remove selected product
   * @param productBody 
   */
  public updateOne = async (productId: string) => {
    try {
      const product = await this.dependencies.productDetailService.findOne(productId)
      // we can also update this to soft delete, or even move it thru archieve.
      const updateProduct = await this.dependencies.repositoryGateway.updateOne({
        _id: productId
      }, {
        purchaseCount: product.purchaseCount + 1
      })
      // add logs here
      return updateProduct
    } catch (error) {
      console.log('failed to create product. \nError :>> ', error);
      throw error
    }
  }
}