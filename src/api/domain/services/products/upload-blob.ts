/**
 * @env_variables
 */
import { NODE_ENV, AZURE_BLOB_CONTAINER_NAME, BACKEND_HOST } from '../../../../config/vars';
/**
 * @constant
 */
import { NODE_ENVIRONMENTS } from '../../../utils/constants';
/**
 * @product_entity
 */
import { 
  IProductBlobProperties,
  IProductContentZip,
  IProductRepositoryGateway,
  PRODUCT_BLOB_TYPE,
  PRODUCT_UPLOAD_BLOB_STATES 
} from '../../entities/product';
/**
 * @general_entity_interfaces
 */
import {  
  IGeneralServiceDependencies,
  IImageResizeOption,
  IUploader
} from '../../interfaces';
interface IUploadProductBlob{
  contentZip: string,
  previewImage: string,
  previewVideo: string,
}
interface IUploadProductBlobResponse {
  contentZip: IProductContentZip,
  previewImage: IProductBlobProperties,
  previewVideo: IProductBlobProperties,
  thumbnail: IProductBlobProperties,
}
interface IServiceDependencies extends IGeneralServiceDependencies<IProductRepositoryGateway> {
  fileUploader: IUploader
  imageResizer: (option: IImageResizeOption) => Promise<string>
  generateGifFromVideo(filepath: string, fileSaveTo: string, option?: {skipTime?: number, duration?: number, scale?: number}): void
}
export class UploadProductBlobService {
  constructor(protected dependencies: IServiceDependencies) {
  }
  /**
   * upload the blob on the storage cloud provider
   * @param productId 
   * @param type 
   * @param blobLocalPath 
   */
  public uploadOne = async (productId: string, type: PRODUCT_BLOB_TYPE, blobLocalPath: string) => {
    try {
      let originalFilepath = ''
      let blobFileName = ''
      let uploadToStorageStatus = false
      let blobContainerName = AZURE_BLOB_CONTAINER_NAME.PUBLIC_BLOB
      let originalFileExtension = blobLocalPath.split('.').pop()
      if (type === PRODUCT_BLOB_TYPE.CONTENT_ZIP) {
        blobFileName = `${productId}/${PRODUCT_BLOB_TYPE.CONTENT_ZIP}.${originalFileExtension}`
        blobContainerName = AZURE_BLOB_CONTAINER_NAME.PRIVATE_BLOB
        // return new Promise((resolve, reject) => {
        //   const blobName = `${productId}-${PRODUCT_BLOB_TYPE.CONTENT_ZIP}.${originalFileExtension}`
        //   this.dependencies.fileUploader.upload(
        //     blobName,
        //     blobLocalPath,
        //     AZURE_BLOB_CONTAINER_NAME.PRIVATE_BLOB,
        //     async (origFilepath) => {
        //       // const hash = <string> await new Promise((resolve) => {
        //       //   new Promise(async (resolve) => {
        //       //     let b64 = ''
        //       //     if (NODE_ENV === NODE_ENVIRONMENTS.PRODUCTION) {
        //       //       try {
        //       //         b64 = await this.dependencies.fileUploader.download(AZURE_BLOB_CONTAINER_NAME.PRIVATE_BLOB, blobName)
        //       //         resolve(b64)
        //       //       } catch (error) {
        //       //         console.log('failed to get data: ', error);
        //       //         throw error
        //       //       }
        //       //     } else {
        //       //       b64 = fs.readFileSync(blobLocalPath, {encoding: 'base64'})
        //       //       // ### DEVNOTE ###
        //       //       // just added 1 second delay here because on local, the uploading of file is too fast.
        //       //       // and uploading finish first instead of saving or insert the product data.
        //       //       setTimeout(() => {
        //       //         resolve(b64)
        //       //       }, 1000)
        //       //     }
        //       //   })
        //       //   .then((b64: string) => {
        //       //     const h = b64 ? md5(Buffer.from(b64, 'base64')) : ''
        //       //     resolve(h)
        //       //   })
        //       //   return
        //       // })
        //       resolve(<any>{
        //         hash: '',
        //         originalFilepath: origFilepath,
        //         blobURL: 
        //           NODE_ENV === NODE_ENVIRONMENTS.PRODUCTION ? 
        //             origFilepath : 
        //             `${BACKEND_HOST}/v1/products/${productId}/${PRODUCT_BLOB_TYPE.CONTENT_ZIP}.${originalFileExtension}`
        //       })
        //       this.dependencies.fileSystem.removeOne(blobLocalPath)
        //       return
        //     })
        // }) as Promise<IProductContentZip>
      } else if (type === PRODUCT_BLOB_TYPE.PREVIEW_VIDEO) {
        blobFileName = `${productId}/${PRODUCT_BLOB_TYPE.PREVIEW_VIDEO}.${originalFileExtension}`
      } else if (type === PRODUCT_BLOB_TYPE.PREVIEW_GIF) {
        originalFileExtension = 'gif'
        const filepath = blobLocalPath.split('.').shift()
        const newFilepath = `${filepath}.${originalFileExtension}`
        const result = this.dependencies.generateGifFromVideo(blobLocalPath, `${filepath}.${originalFileExtension}`, {
          scale: 400
        })
        blobLocalPath = newFilepath
        blobFileName = `${productId}/${PRODUCT_BLOB_TYPE.PREVIEW_GIF}.${originalFileExtension}`
      } else if (type === PRODUCT_BLOB_TYPE.PREVIEW_IMAGE) {
        blobFileName = `${productId}/${PRODUCT_BLOB_TYPE.PREVIEW_IMAGE}.${originalFileExtension}`
      } else if (type === PRODUCT_BLOB_TYPE.THUMBNAIL) {
        const origPreviewImage = blobLocalPath.split('.')
        const blobType = origPreviewImage.pop()
        const
          width = 400;
        const newFilepath = `${origPreviewImage.join('.')}-w${width}.${blobType}`
        // resize the image preview to 150(h)x150(w)
        try {
          blobFileName = `${productId}/${PRODUCT_BLOB_TYPE.THUMBNAIL}.${originalFileExtension}`
          originalFilepath = newFilepath
          await this.dependencies.imageResizer({
            filepath: blobLocalPath,
            width,
            newFilepath 
          })
          blobLocalPath = newFilepath
        } catch (error) {
          console.log('error :>> ', error);
          throw error
        }
      }
      try {
        originalFilepath = await this.dependencies.fileUploader.upload(
          blobFileName,
          blobLocalPath,
          blobContainerName
        )
        uploadToStorageStatus = true
      } catch (error) {
        uploadToStorageStatus = false
      }
      return {
        // blobURL: 
        //   NODE_ENV === NODE_ENVIRONMENTS.PRODUCTION ? 
        //   originalFilepath : 
        //     `${BACKEND_HOST}/v1/products/${productId}/${type}.${originalFileExtension}`,
        blobURL: originalFilepath,
        localFilepath: blobLocalPath,
        originalFilepath: originalFilepath,
        uploadToStorageStatus
      }
    } catch (error) {
      console.log('error :>> ', error);
      throw error
    }
  }
  // public uploadAll = async (productId: string, productBody: IUploadProductBlob) => {
  //   try {
  //     const {contentZip, previewVideo, previewImage} = productBody
  //     const uploadedBlobURLs = <IUploadProductBlobResponse>{}
  //     if (contentZip) {
  //       const q = this.uploadBlob(productId, PRODUCT_BLOB_TYPE.CONTENT_ZIP, contentZip)
  //     }
  //     if (previewImage) {
  //       uploadedBlobURLs.previewImage = await this.uploadBlob(productId, PRODUCT_BLOB_TYPE.PREVIEW_IMAGE, previewImage)
  //       uploadedBlobURLs.thumbnail = await this.uploadBlob(productId, PRODUCT_BLOB_TYPE.THUMBNAIL, previewImage)
  //     }
  //     if (previewVideo) {
  //       uploadedBlobURLs.previewVideo = await this.uploadBlob(productId, PRODUCT_BLOB_TYPE.PREVIEW_VIDEO, previewVideo)
  //     }
  //     // add logs
  //     return uploadedBlobURLs
  //   } catch (error) {
  //     console.log('failed to create product. \nError :>> ', error);
  //     throw error
  //   }
  // }
  // private uploadBlob = async (productId: string, productBlobType: PRODUCT_BLOB_TYPE, blobLocalPath: string) => {
  //   let blobProperty = <IProductBlobProperties>{
  //     blobURL: '',
  //     originalFilepath: '',
  //     state: PRODUCT_UPLOAD_BLOB_STATES.PENDING
  //   }
  //   try {
  //     const response = await this.uploadOne(productId, productBlobType, blobLocalPath)
  //     blobProperty = {
  //       ...response,
  //       state: PRODUCT_UPLOAD_BLOB_STATES.COMPLETED
  //     }
  //   } catch (error) {
  //     blobProperty.state = PRODUCT_UPLOAD_BLOB_STATES.FAILED
  //   }
  //   return blobProperty
  // }
}