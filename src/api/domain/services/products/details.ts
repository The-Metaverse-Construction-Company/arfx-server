import {
  IProductRepositoryGateway
} from '../../entities/product'
import { IGeneralServiceDependencies } from '../../interfaces';
interface IDependencies extends IGeneralServiceDependencies<IProductRepositoryGateway> {}
export class ProductDetailService {
  constructor(protected dependencies: IDependencies) {
  }
  /**
   * create new product.
   * @param productBody 
   */
  public findOne = async (productId: string) => {
    try {
      // get list in the repo
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