import {
  IProdutBody,
  IProductRepositoryGateway
} from '../../entities/product'
import {
  ProductEntity
} from '../../entities'
import { IGeneralServiceDependencies } from '../../interfaces';

interface IDependencies extends IGeneralServiceDependencies<IProductRepositoryGateway> {}
export class CreateProduct {
  constructor(protected dependencies: IDependencies) {
  }
  /**
   * create new product.
   * @param productBody 
   */
  public createOne (productBody: IProdutBody) {
    try {
      const newProductEntity = new ProductEntity(productBody)
      // insert it thru the repo.
      this.dependencies.repositoryGateway.insertOne(newProductEntity)
      // add logs
      return newProductEntity
    } catch (error) {
      console.log('failed to create product. \nError :>> ', error);
      throw error
    }
  }
}