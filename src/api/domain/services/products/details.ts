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
interface IDependencies extends IGeneralServiceDependencies<IProductRepositoryGateway> {}
export class ProductDetailService {
  constructor(protected dependencies: IDependencies) {
  }
  /**
   * get product details.
   * @param productId 
   */
  public findOne = async (productId: string) => {
    try {
      // get product details.
      const product = await this.dependencies.repositoryGateway.findOne({
        _id: productId,
        deleted: false
      })
      return product
    } catch (error) {
      console.log('failed to create product. \nError :>> ', error);
      throw error
    }
  }
}