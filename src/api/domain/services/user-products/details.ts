/**
 * @env_variables
 */
import { AZURE_BLOB_CONTAINER_NAME } from '../../../../config/vars';
/**
 * @entity
 */
import {
  IUserProductsRepositoryGateway,
} from '../../entities/user-products'
/**
 * @general_entity_interfaces
 */
import { IBlobStorage, IGeneralServiceDependencies } from '../../interfaces';
interface IDependencies extends IGeneralServiceDependencies<IUserProductsRepositoryGateway> {
  blobStorage: IBlobStorage
}
export class UserProductDetailsService {
  constructor(protected dependencies: IDependencies) {
  }
  /**
   * get the user product details.
   * @param userId 
   * @param id // can be userProductId productId
   */
  public getOne = async (userId: string, id: string) => {
    try {
      // get the user product details.
      const userProduct = await this.dependencies.repositoryGateway.getOneByUserId(userId, id)
      if (userProduct) {
        // get the blob name by convertiong the string to array and separated by "/" and then get the last element to get the blob name.
        const blobName = userProduct.contentZip.blobURL.split(AZURE_BLOB_CONTAINER_NAME.PRIVATE_BLOB).pop()
        // generate azure AD SAS Query params for the client app to fetch or able to donwload the content zip
        const azureADSASQueryParams = this.dependencies.blobStorage.generateSASToken(
          AZURE_BLOB_CONTAINER_NAME.PRIVATE_BLOB,
          decodeURIComponent(blobName.substr(1)) // substring the blobname start to 1 to remove the first character which is "/"
        )
        // overwrite the value of content zip blob url which is the zip file for the product/scene.
        userProduct.contentZip.blobURL = `${userProduct.contentZip.blobURL}?${azureADSASQueryParams}`
      }
      // add some logs here.
      return userProduct
    } catch (error) {
      console.log('failed to get user product. \nError :>> ', error);
      throw error
    }
  }
}