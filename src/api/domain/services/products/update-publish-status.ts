import {
  IProductRepositoryGateway
} from '../../entities/product'
import { IGeneralServiceDependencies } from '../../interfaces';
interface IServiceDependencies extends IGeneralServiceDependencies<IProductRepositoryGateway> {}
export class UpdateProductPublishStatusService {
  constructor(protected dependencies: IServiceDependencies) {
  }
  /**
   * update the status of the product publish
   *  - false: unpublish which is will not shown on the product list
   *  - true: published show on the product list.
   * @param productBody 
   */
  public updateOne = async (productId: string, status: boolean = true) => {
    try {
      // we can also update this to soft delete, or even move it thru archieve.
      const updateProduct = await this.dependencies.repositoryGateway.updateOne({
        _id: productId,
        deleted: false
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