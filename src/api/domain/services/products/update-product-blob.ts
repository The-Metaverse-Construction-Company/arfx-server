/**
 * @entity_interfaces
 */
import {
  IProductBlobProperties,
  IProductEntity,
  IProductRepositoryGateway,
  PRODUCT_BLOB_TYPE,
  PRODUCT_STATES,
  PRODUCT_UPLOAD_BLOB_STATES
} from '../../entities/product'
/**
 * @entity
 */
import {
  ProductEntity
} from '../../entities'
/**
 * @services
 */
import {
  UploadProductBlobService,
  ProductDetailService
} from './'
/**
 * @general_interfaces
 */
import { IGeneralServiceDependencies } from '../../interfaces';
interface IProductBlobResponseProperties extends IProductBlobProperties {
  localFilepath: string
}
interface IFileSystem {
  removeOne(filepath: string): void
}
interface IDependencies extends IGeneralServiceDependencies<IProductRepositoryGateway> {
  uploadProductBlobService: UploadProductBlobService
  productDetailService: ProductDetailService
  fileSystem: IFileSystem
}
export class UpdateProductBlobService {
  constructor(protected dependencies: IDependencies) {}
  /**
   * upload each blob.
   * @param productId 
   * @param productBlobType 
   * @param blobLocalPath 
   */
  private uploadBlobToBlobStorage = async (productId: string, productBlobType: PRODUCT_BLOB_TYPE, uploadedBlob: File) => {
    let blobProperty = <IProductBlobResponseProperties>{
      state: PRODUCT_UPLOAD_BLOB_STATES.PENDING,
      localFilepath: '',
      originalFilepath: '',
      blobURL: '',
    }
    try {
      const {
        blobURL,
        localFilepath,
        originalFilepath,
        uploadToStorageStatus
      } = await this.dependencies.uploadProductBlobService.uploadOne(productId, productBlobType, uploadedBlob)
      blobProperty = {
        blobURL,
        originalFilepath,
        localFilepath,
        state: uploadToStorageStatus ? PRODUCT_UPLOAD_BLOB_STATES.COMPLETED : PRODUCT_UPLOAD_BLOB_STATES.FAILED
      }
    } catch (error) {
      blobProperty.state = PRODUCT_UPLOAD_BLOB_STATES.FAILED
    }
    return blobProperty
  }
  /**
   * update the product blobs
   *  - previewImage
   *  - previewVideo
   *  - previewGif
   *  - thumbnail
   *  - contentZip
   * @param productBody 
   */
  public updateOne = async (productId: string, productBlobType: PRODUCT_BLOB_TYPE, uploadedBlob: File) => {
    try {
      const product = await this.dependencies.productDetailService.findOne(productId)
      let {localFilepath, ...blobProperty} = await this.uploadBlobToBlobStorage(productId, productBlobType, uploadedBlob)
      const propertiesToUpdate = <Partial<IProductEntity>>{}
      if (productBlobType === PRODUCT_BLOB_TYPE.PREVIEW_IMAGE) {
        // call another one for the thumbnail
        if (blobProperty.state === PRODUCT_UPLOAD_BLOB_STATES.COMPLETED) {
          propertiesToUpdate.previewImage = blobProperty
        } else {
          propertiesToUpdate.previewImage = {
            ...product.previewImage,
            state: blobProperty.state
          }
        }
        const {localFilepath, ...thumbnailBlobProperty} = await this.uploadBlobToBlobStorage(productId, PRODUCT_BLOB_TYPE.THUMBNAIL, uploadedBlob)
        if (thumbnailBlobProperty.state === PRODUCT_UPLOAD_BLOB_STATES.COMPLETED) {
          propertiesToUpdate.thumbnail = thumbnailBlobProperty
        } else {
          propertiesToUpdate.thumbnail = {
            ...product.thumbnail,
            state: blobProperty.state
          }
        }
        this.dependencies.fileSystem.removeOne(localFilepath)
      } else if (productBlobType === PRODUCT_BLOB_TYPE.PREVIEW_VIDEO) {
        if (blobProperty.state === PRODUCT_UPLOAD_BLOB_STATES.COMPLETED) {
          propertiesToUpdate.previewVideo = blobProperty
          const {localFilepath, ...previewGifProperty} = await this.uploadBlobToBlobStorage(productId, PRODUCT_BLOB_TYPE.PREVIEW_GIF, uploadedBlob)
          if (previewGifProperty.state === PRODUCT_UPLOAD_BLOB_STATES.COMPLETED) {
            propertiesToUpdate.previewGif = previewGifProperty
          } else {
            propertiesToUpdate.previewGif = {
              ...product.previewGif,
              state: blobProperty.state
            }
          }
          this.dependencies.fileSystem.removeOne(localFilepath)
        } else {
          propertiesToUpdate.previewVideo = {
            ...product.previewVideo,
            state: blobProperty.state
          }
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
          ...product.contentZip,
          ...propertiesToUpdate.contentZip,
          state: PRODUCT_UPLOAD_BLOB_STATES.COMPLETED
        }
      } else {
        throw new Error('Invalid blob type.')
      }
      // initiate to run the business rules validations
      const productEntity = new ProductEntity({
        ...product,
        ...propertiesToUpdate
      })
      //check if the product state is still not completed, then if not, still update the blob state until it's not completed.
      if (!(product.state === PRODUCT_STATES.COMPLETED)) {
        if ((productEntity.contentZip.state === PRODUCT_UPLOAD_BLOB_STATES.COMPLETED &&
          productEntity.previewImage.state === PRODUCT_UPLOAD_BLOB_STATES.COMPLETED &&
          productEntity.previewVideo.state === PRODUCT_UPLOAD_BLOB_STATES.COMPLETED &&
          productEntity.previewGif.state === PRODUCT_UPLOAD_BLOB_STATES.COMPLETED &&
          productEntity.thumbnail.state === PRODUCT_UPLOAD_BLOB_STATES.COMPLETED)) {
            propertiesToUpdate.state = PRODUCT_STATES.COMPLETED
          } else if ((productEntity.contentZip.state === PRODUCT_UPLOAD_BLOB_STATES.FAILED ||
            productEntity.previewImage.state === PRODUCT_UPLOAD_BLOB_STATES.FAILED ||
            productEntity.previewVideo.state === PRODUCT_UPLOAD_BLOB_STATES.FAILED ||
            productEntity.previewGif.state === PRODUCT_UPLOAD_BLOB_STATES.FAILED ||
            productEntity.thumbnail.state === PRODUCT_UPLOAD_BLOB_STATES.FAILED)) {
              propertiesToUpdate.state = PRODUCT_STATES.FAILED
          }
      }
      this.dependencies.fileSystem.removeOne(localFilepath)
      //update it to our product repository.
      const updatedProduct = await this.dependencies.repositoryGateway.updateOne({
        _id: productId
      }, propertiesToUpdate)
      // add logs
      return updatedProduct
    } catch (error) {
      console.log('failed to update product. \nError :>> ', error);
      throw error
    }
  }
}