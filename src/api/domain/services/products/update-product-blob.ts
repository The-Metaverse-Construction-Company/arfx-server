import {
  IProductBlob,
  IProductRepositoryGateway,
  PRODUCT_BLOB_TYPE
} from '../../entities/product'
import {
  ProductEntity
} from '../../entities'
import {
  UploadProductBlobService
} from '../products'
import { IGeneralServiceDependencies } from '../../interfaces';

interface IDependencies extends IGeneralServiceDependencies<IProductRepositoryGateway> {
  uploadProductBlobService: UploadProductBlobService
}
export class UpdateProductBlobService {
  constructor(protected dependencies: IDependencies) {
  }
  /**
   * create new product.
   * @param productBody 
   */
  public updateOne = async (productId: string, productBlobType: PRODUCT_BLOB_TYPE, blobLocalPath: string) => {
    try {
      const blobProperty = await this.dependencies.uploadProductBlobService.uploadOne(productId, productBlobType, blobLocalPath)
      const propertiesToUpdate = <Partial<IProductBlob>>{}
      if (productBlobType === PRODUCT_BLOB_TYPE.PREVIEW_IMAGE) {
        // call another one for the thumbnail
        const thumbnailBlobProperty = await this.dependencies.uploadProductBlobService.uploadOne(productId, PRODUCT_BLOB_TYPE.THUMBNAIL, blobLocalPath)
        propertiesToUpdate.previewImage = blobProperty
        propertiesToUpdate.thumbnail = thumbnailBlobProperty
      } else if (productBlobType === PRODUCT_BLOB_TYPE.PREVIEW_VIDEO) {
        propertiesToUpdate.previewVideo = blobProperty
      } else if (productBlobType === PRODUCT_BLOB_TYPE.CONTENT_ZIP) {
        //@ts-expect-error
        propertiesToUpdate['contentZip.hash'] = blobProperty.hash
        propertiesToUpdate['contentZip.blobURL'] = blobProperty.blobURL
        propertiesToUpdate['contentZip.originalFilepath'] = blobProperty.originalFilepath
      }
      const updatedProduct = await this.dependencies.repositoryGateway.updateOne({
        _id: productId
      }, propertiesToUpdate)
      // add logs
      return updatedProduct
      return true
    } catch (error) {
      console.log('failed to update product. \nError :>> ', error);
      throw error
    }
  }
}