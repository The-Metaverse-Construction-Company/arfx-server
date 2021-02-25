import { AZURE_BLOB_CONTAINER_NAME } from '../../../utils/constants';
import { IProductEntity } from '../../entities/product';
import {
  IUserProductsRepositoryGateway,
} from '../../entities/user-products'
import { IBlobStorage, IGeneralServiceDependencies } from '../../interfaces';
interface IDependencies extends IGeneralServiceDependencies<IUserProductsRepositoryGateway> {
  blobStorage: IBlobStorage
}
export class UserProductDetailsService {
  constructor(protected dependencies: IDependencies) {
  }
  /**
   * 
   * @param userId 
   * @param id // can be userProductId productId
   */
  public getOne = async (userId: string, id: string) => {
    try {
      const userProduct = await this.dependencies.repositoryGateway.getOneByUserId(userId, id)
      if (userProduct) {
        const blobName = userProduct.contentZip.blobURL.split('/').pop()
        const sasToken = this.dependencies.blobStorage.generateSASToken(AZURE_BLOB_CONTAINER_NAME.PRIVATE_BLOB, blobName)
        userProduct.contentZip.blobURL = `${userProduct.contentZip.blobURL}?${sasToken}`
      }
      // add some logs here.
      return userProduct
    } catch (error) {
      console.log('failed to get user product. \nError :>> ', error);
      throw error
    }
  }
}