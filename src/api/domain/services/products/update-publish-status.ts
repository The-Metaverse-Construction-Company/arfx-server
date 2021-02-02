import {
  IProductRepositoryGateway
} from '../../entities/product'
import { IGeneralServiceDependencies } from '../../interfaces';
interface IDependencies extends IGeneralServiceDependencies<IProductRepositoryGateway> {}
export class UpdateProductPublishStatus {
  constructor(protected dependencies: IDependencies) {
  }
  /**
   * remove selected product
   * @param productBody 
   */
  public updateOne = async (productId: string, status: boolean = true) => {
    try {
      console.log('statusx :>> ', productId);
      console.log('statusx :>> ', status);
      // we can also update this to soft delete, or even move it thru archieve.
      const updateProduct = await this.dependencies.repositoryGateway.updateOne({
        _id: productId
      }, {
        published: status
      })
      // add logs here
      return updateProduct
    } catch (error) {
      console.log('failed to create product. \nError :>> ', error);
      throw error
    }
  }
}