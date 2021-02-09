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
  public updateOne = async (productId: string, contentURL: string) => {
    try {
      // const updatedProduct = await this.dependencies.repositoryGateway.updateOne({
      //   _id: productId
      // }, {
      //   contentZip: {blobURL: '', originalFilepath: },
      // })
      // add logs
      // return updatedProduct
      return true
    } catch (error) {
      console.log('failed to update product. \nError :>> ', error);
      throw error
    }
  }
}