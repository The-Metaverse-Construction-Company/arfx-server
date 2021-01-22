import {
  IProductRepositoryGateway
} from '../../entities/product'
import { IGeneralServiceDependencies } from '../../interfaces';
interface IDependencies extends IGeneralServiceDependencies<IProductRepositoryGateway> {}
export class RemoveProduct {
  constructor(protected dependencies: IDependencies) {
  }
  /**
   * remove selected product
   * @param productBody 
   */
  public removeOne = async (productId: string) => {
    try {
      // we can also update this to soft delete, or even move it thru archieve.
      const removedProduct = await this.dependencies.repositoryGateway.removeOne({
        _id: productId
      })
      // add logs here
      return removedProduct
    } catch (error) {
      console.log('failed to create product. \nError :>> ', error);
      throw error
    }
  }
}