import {
  IProductRepositoryGateway,
  IProdutBody
} from '../../entities/product'
import {
  ProductEntity
} from '../../entities'

import { IGeneralServiceDependencies } from '../../interfaces';

interface IDependencies extends IGeneralServiceDependencies<IProductRepositoryGateway> {}
export class UpdateProductURLService {
  constructor(protected dependencies: IDependencies) {
  }
  /**
   * create new product.
   * @param productBody 
   */
  public updateOne = async (productId: string, productURL: string) => {
    try {
      const updatedProduct = await this.dependencies.repositoryGateway.updateOne({
        _id: productId
      }, {
        productURL: productURL,
      })
      // add logs
      return updatedProduct
    } catch (error) {
      console.log('failed to update product. \nError :>> ', error);
      throw error
    }
  }
}