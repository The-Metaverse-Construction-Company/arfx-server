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

interface IServiceDependencies extends IGeneralServiceDependencies<IProductRepositoryGateway> {}
export class RemoveProductService {
  constructor(protected dependencies: IServiceDependencies) {
  }
  /**
   * remove selected product
   * @param productId 
   */
  public removeOne = async (productId: string) => {
    try {
      // we can also update this to soft delete, or even move it thru archieve.
      const softRemovedProduct = await this.dependencies.repositoryGateway.updateOne({
        _id: productId,
        deleted: false
      }, {
        deleted: true
      })
      // add logs here
      return softRemovedProduct
    } catch (error) {
      console.log('failed to create product. \nError :>> ', error);
      throw error
    }
  }
}