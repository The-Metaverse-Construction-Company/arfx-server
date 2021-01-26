import {
  IProdutBody,
  IProductRepositoryGateway
} from '../../entities/product'
import {
  ProductEntity
} from '../../entities'
import { IGeneralServiceDependencies } from '../../interfaces';

interface IDependencies extends IGeneralServiceDependencies<IProductRepositoryGateway> {}
export class CreateProductService {
  constructor(protected dependencies: IDependencies) {
  }
  /**
   * create new product.
   * @param productBody 
   */
  public createOne = async (productBody: IProdutBody, adminAccountId: string) => {
    try {
      const newProductEntity = new ProductEntity({
        ...productBody,
        adminAccountId: adminAccountId
      })
      // insert it thru the repo.
      await this.dependencies.repositoryGateway.insertOne(newProductEntity)
      // add logs
      return newProductEntity
    } catch (error) {
      console.log('failed to create product. \nError :>> ', error);
      throw error
    }
  }
}