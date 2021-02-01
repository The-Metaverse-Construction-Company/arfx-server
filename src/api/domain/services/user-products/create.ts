import {
  IUserProductsRepositoryGateway,
  IUserProductsParams
} from '../../entities/user-products'
import {
  UserProductsEntity
} from '../../entities'
import { IGeneralServiceDependencies } from '../../interfaces';
interface IDependencies extends IGeneralServiceDependencies<IUserProductsRepositoryGateway> {}
export class CreateUserProductsService {
  constructor(protected dependencies: IDependencies) {
  }
  /**
   * find purchase history details
   * @param productBody 
   */
  public createOne = async (userProductsParam: IUserProductsParams) => {
    try {
      const newUserProduct = new UserProductsEntity(userProductsParam)
      // insert it thru user products repository
      const userProduct = await this.dependencies.repositoryGateway.insertOne(newUserProduct)
      // add some logs here.
      return newUserProduct
    } catch (error) {
      console.log('failed to create user product. \nError :>> ', error);
      throw error
    }
  }
}