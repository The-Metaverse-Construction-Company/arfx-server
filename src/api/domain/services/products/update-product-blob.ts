import fs from 'fs'
import {
  IProductBlob,
  IProductBlobProperties,
  IProductEntity,
  IProductRepositoryGateway,
  PRODUCT_BLOB_TYPE,
  PRODUCT_STATES,
  PRODUCT_UPLOAD_BLOB_STATES
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
  private uploadBlob = async (productId: string, productBlobType: PRODUCT_BLOB_TYPE, blobLocalPath: string) => {
    let blobProperty = <IProductBlobProperties>{
      state: PRODUCT_UPLOAD_BLOB_STATES.PENDING
    }
    try {
      const response = await this.dependencies.uploadProductBlobService.uploadOne(productId, productBlobType, blobLocalPath)
      blobProperty = {
        ...response,
        state: PRODUCT_UPLOAD_BLOB_STATES.COMPLETED
      }
    } catch (error) {
      blobProperty.state = PRODUCT_UPLOAD_BLOB_STATES.FAILED
    }
    return blobProperty
  }
  /**
   * create new product.
   * @param productBody 
   */
  public updateOne = async (productId: string, productBlobType: PRODUCT_BLOB_TYPE, blobLocalPath: string, fromUpdate: boolean = false) => {
    try {
      const product = await this.dependencies.repositoryGateway.findOne({
        _id: productId
      })
      let blobProperty = await this.uploadBlob(productId, productBlobType, blobLocalPath)
      console.log('blobProperty :>> ', blobProperty);
      const propertiesToUpdate = <Partial<IProductEntity>>{}
      if (productBlobType === PRODUCT_BLOB_TYPE.PREVIEW_IMAGE) {
        // call another one for the thumbnail
        const thumbnailBlobProperty = await this.uploadBlob(productId, PRODUCT_BLOB_TYPE.THUMBNAIL, blobLocalPath)
        if (blobProperty.state === PRODUCT_UPLOAD_BLOB_STATES.COMPLETED) {
          propertiesToUpdate.previewImage = blobProperty
        } else {
          propertiesToUpdate['previewImage.state'] = blobProperty.state
        }
        if (thumbnailBlobProperty.state === PRODUCT_UPLOAD_BLOB_STATES.COMPLETED) {
          propertiesToUpdate.thumbnail = thumbnailBlobProperty
        } else {
          propertiesToUpdate['thumbnail.state'] = thumbnailBlobProperty.state
        }
      } else if (productBlobType === PRODUCT_BLOB_TYPE.PREVIEW_VIDEO) {
        if (blobProperty.state === PRODUCT_UPLOAD_BLOB_STATES.FAILED) {
          propertiesToUpdate['previewVideo.state'] = blobProperty.state
        } else {
          propertiesToUpdate.previewVideo = blobProperty
        }
      } else if (productBlobType === PRODUCT_BLOB_TYPE.CONTENT_ZIP) {
        if (blobProperty.state === PRODUCT_UPLOAD_BLOB_STATES.COMPLETED) {
          //@ts-expect-error
          propertiesToUpdate['contentZip.hash'] = blobProperty.hash
          propertiesToUpdate['contentZip.blobURL'] = blobProperty.blobURL
          propertiesToUpdate['contentZip.originalFilepath'] = blobProperty.originalFilepath
          propertiesToUpdate['contentZip.version'] = product.contentZip.version + 1
        }
        propertiesToUpdate['contentZip.state'] = blobProperty.state
      } else {
        throw new Error('Invalid blob type.')
      }
      const productEntity = new ProductEntity({
        ...product,
        ...propertiesToUpdate
      })
      if (!fromUpdate) {
        if ((productEntity.contentZip.state === PRODUCT_UPLOAD_BLOB_STATES.COMPLETED &&
          productEntity.previewImage.state === PRODUCT_UPLOAD_BLOB_STATES.COMPLETED &&
          productEntity.previewVideo.state === PRODUCT_UPLOAD_BLOB_STATES.COMPLETED &&
          productEntity.thumbnail.state === PRODUCT_UPLOAD_BLOB_STATES.COMPLETED)) {
            propertiesToUpdate.state = PRODUCT_STATES.COMPLETED
          } else if ((productEntity.contentZip.state === PRODUCT_UPLOAD_BLOB_STATES.FAILED ||
            productEntity.previewImage.state === PRODUCT_UPLOAD_BLOB_STATES.FAILED ||
            productEntity.previewVideo.state === PRODUCT_UPLOAD_BLOB_STATES.FAILED ||
            productEntity.thumbnail.state === PRODUCT_UPLOAD_BLOB_STATES.FAILED)) {
              propertiesToUpdate.state = PRODUCT_STATES.FAILED
          }
      }
      const updatedProduct = await this.dependencies.repositoryGateway.updateOne({
        _id: productId
      }, propertiesToUpdate)
      fs.unlinkSync(blobLocalPath)
      // add logs
      return updatedProduct
    } catch (error) {
      console.log('failed to update product. \nError :>> ', error);
      throw error
    }
  }
}