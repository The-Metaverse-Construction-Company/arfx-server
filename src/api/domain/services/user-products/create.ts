/**
 * @entity_interfaces
 */
import {
  IUserProductsRepositoryGateway,
  IUserProductsParams
} from '../../entities/user-products'
/**
 * @entity
 */
import {
  UserProductsEntity
} from '../../entities'
/**
 * @general_interfaces
 */
import { IGeneralServiceDependencies } from '../../interfaces';
interface IDependencies extends IGeneralServiceDependencies<IUserProductsRepositoryGateway> {}
export class CreateUserProductsService {
  constructor(protected dependencies: IDependencies) {
  }
  /**
   * create user products/my scene
   * @param userProductsParam 
   */
  public createOne = async (userProductsParam: IUserProductsParams) => {
    try {
      // initialize the user product entity to run the business roles implemented inside.
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