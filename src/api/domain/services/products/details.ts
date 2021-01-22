import {
  IProductRepositoryGateway
} from '../../entities/product'
import { IGeneralServiceDependencies } from '../../interfaces';
interface IDependencies extends IGeneralServiceDependencies<IProductRepositoryGateway> {}
export class ProductDetails {
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
        _id: productId
      })
      return product
    } catch (error) {
      console.log('failed to create product. \nError :>> ', error);
      throw error
    }
  }
}