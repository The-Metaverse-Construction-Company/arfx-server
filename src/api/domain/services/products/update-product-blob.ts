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
  UploadProductBlobService,
  ProductDetailService
} from './'
import { IGeneralServiceDependencies } from '../../interfaces';

interface IDependencies extends IGeneralServiceDependencies<IProductRepositoryGateway> {
  uploadProductBlobService: UploadProductBlobService
  productDetailService: ProductDetailService
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
  public updateOne = async (productId: string, productBlobType: PRODUCT_BLOB_TYPE, blobLocalPath: string) => {
    try {
      const product = await this.dependencies.productDetailService.findOne(productId)
      let blobProperty = await this.uploadBlob(productId, productBlobType, blobLocalPath)
      const propertiesToUpdate = <Partial<IProductEntity>>{}
      if (productBlobType === PRODUCT_BLOB_TYPE.PREVIEW_IMAGE) {
        // call another one for the thumbnail
        const thumbnailBlobProperty = await this.uploadBlob(productId, PRODUCT_BLOB_TYPE.THUMBNAIL, blobLocalPath)
        if (blobProperty.state === PRODUCT_UPLOAD_BLOB_STATES.COMPLETED) {
          propertiesToUpdate.previewImage = blobProperty
        } else {
          propertiesToUpdate.previewImage = {
            ...product.previewImage,
            state: blobProperty.state
          }
        }
        if (thumbnailBlobProperty.state === PRODUCT_UPLOAD_BLOB_STATES.COMPLETED) {
          propertiesToUpdate.thumbnail = thumbnailBlobProperty
        } else {
          propertiesToUpdate.thumbnail = {
            ...product.thumbnail,
            state: blobProperty.state
          }
        }
      } else if (productBlobType === PRODUCT_BLOB_TYPE.PREVIEW_VIDEO) {
        if (blobProperty.state === PRODUCT_UPLOAD_BLOB_STATES.FAILED) {
          propertiesToUpdate.previewVideo = {
            ...product.previewVideo,
            state: blobProperty.state
          }
        } else {
          propertiesToUpdate.previewVideo = blobProperty
        }
      } else if (productBlobType === PRODUCT_BLOB_TYPE.CONTENT_ZIP) {
        if (blobProperty.state === PRODUCT_UPLOAD_BLOB_STATES.COMPLETED) {
          propertiesToUpdate.contentZip = {
          //@ts-expect-error
            hash: blobProperty.hash,
            blobURL: blobProperty.blobURL,
            originalFilepath: blobProperty.originalFilepath,
            version: product.contentZip.version + 1,
            state: PRODUCT_UPLOAD_BLOB_STATES.PENDING
          }
        }
        propertiesToUpdate.contentZip = {
          ...propertiesToUpdate.contentZip,
          ...product.contentZip,
          state: PRODUCT_UPLOAD_BLOB_STATES.COMPLETED
        }
      } else {
        throw new Error('Invalid blob type.')
      }
      const productEntity = new ProductEntity({
        ...product,
        ...propertiesToUpdate
      })
      //check if the product state is still not completed, then if not, still update the blob state until it's not completed.
      if (!(product.state === PRODUCT_STATES.COMPLETED)) {
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