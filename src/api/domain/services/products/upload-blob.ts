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
}
export class UploadProductBlobService {
  constructor(protected dependencies: IServiceDependencies) {
  }
  /**
   * get the blob extension.
   * @param filename
   */
  private getBlobExtension = (filename: string) => {
    const blobArr = filename.split('.')
    return blobArr.length >= 1 ? blobArr[blobArr.length -1] : ''
  }
  /**
   * upload the blob on the storage cloud provider
   * @param productId 
   * @param type 
   * @param blobLocalPath 
   */
  public uploadOne = async (productId: string, type: PRODUCT_BLOB_TYPE, blobLocalPath: string) => {
    try {
      if (type === PRODUCT_BLOB_TYPE.CONTENT_ZIP) {
        return new Promise((resolve, reject) => {
          const blobName = `${productId}-${PRODUCT_BLOB_TYPE.CONTENT_ZIP}.${this.getBlobExtension(blobLocalPath)}`
          this.dependencies.fileUploader.upload(
            blobName,
            blobLocalPath,
            AZURE_BLOB_CONTAINER_NAME.PRIVATE_BLOB,
            async (origFilepath) => {
              // const hash = <string> await new Promise((resolve) => {
              //   new Promise(async (resolve) => {
              //     let b64 = ''
              //     if (NODE_ENV === NODE_ENVIRONMENTS.PRODUCTION) {
              //       try {
              //         b64 = await this.dependencies.fileUploader.download(AZURE_BLOB_CONTAINER_NAME.PRIVATE_BLOB, blobName)
              //         resolve(b64)
              //       } catch (error) {
              //         console.log('failed to get data: ', error);
              //         throw error
              //       }
              //     } else {
              //       b64 = fs.readFileSync(blobLocalPath, {encoding: 'base64'})
              //       // ### DEVNOTE ###
              //       // just added 1 second delay here because on local, the uploading of file is too fast.
              //       // and uploading finish first instead of saving or insert the product data.
              //       setTimeout(() => {
              //         resolve(b64)
              //       }, 1000)
              //     }
              //   })
              //   .then((b64: string) => {
              //     const h = b64 ? md5(Buffer.from(b64, 'base64')) : ''
              //     resolve(h)
              //   })
              //   return
              // })
              resolve(<any>{
                hash: '',
                originalFilepath: origFilepath,
                blobURL: 
                  NODE_ENV === NODE_ENVIRONMENTS.PRODUCTION ? 
                    origFilepath : 
                    `${BACKEND_HOST}/v1/products/${productId}/${PRODUCT_BLOB_TYPE.CONTENT_ZIP}.${this.getBlobExtension(blobLocalPath)}`
              })
              return
            })
        }) as Promise<IProductContentZip>
      } else if (type === PRODUCT_BLOB_TYPE.PREVIEW_VIDEO) {
        const origFilepath = await this.dependencies.fileUploader.upload(
          `${productId}-${PRODUCT_BLOB_TYPE.PREVIEW_VIDEO}.${this.getBlobExtension(blobLocalPath)}`,
          blobLocalPath,
          AZURE_BLOB_CONTAINER_NAME.PUBLIC_BLOB
        )
        // upload to cloud storage provider
        return {
          blobURL: 
            NODE_ENV === NODE_ENVIRONMENTS.PRODUCTION ? 
              origFilepath : 
              `${BACKEND_HOST}/v1/products/${productId}/${PRODUCT_BLOB_TYPE.PREVIEW_VIDEO}.${this.getBlobExtension(blobLocalPath)}`,
          // blobURL: origFilepath,
          originalFilepath: origFilepath 
        }
      } else if (type === PRODUCT_BLOB_TYPE.PREVIEW_IMAGE) {
        const origFilepath = await this.dependencies.fileUploader.upload(
          `${productId}-${PRODUCT_BLOB_TYPE.PREVIEW_IMAGE}.${this.getBlobExtension(blobLocalPath)}`,
            blobLocalPath,
              AZURE_BLOB_CONTAINER_NAME.PUBLIC_BLOB
            )
          // upload to cloud storage provider
          return {
            blobURL: 
              NODE_ENV === NODE_ENVIRONMENTS.PRODUCTION ? 
                origFilepath : 
                `${BACKEND_HOST}/v1/products/${productId}/${PRODUCT_BLOB_TYPE.PREVIEW_IMAGE}.${this.getBlobExtension(blobLocalPath)}`,
            // blobURL: origFilepath,
            originalFilepath: origFilepath
          }
      } else if (type === PRODUCT_BLOB_TYPE.THUMBNAIL) {
        const origPreviewImage = blobLocalPath.split('.')
        const blobType = origPreviewImage.pop()
        const 
          width = 400;
        const newFilepath = `${origPreviewImage.join('.')}-w${width}.${blobType}`
        // resize the image preview to 150(h)x150(w)
        await this.dependencies.imageResizer({
          filepath: blobLocalPath,
          width,
          newFilepath 
        })
        let thumbnailOrigFilepath = newFilepath
        if (NODE_ENV === NODE_ENVIRONMENTS.PRODUCTION) {
          // upload it thru storage cloud provider
          thumbnailOrigFilepath = await this.dependencies.fileUploader.upload(
            `${productId}-${PRODUCT_BLOB_TYPE.THUMBNAIL}.${this.getBlobExtension(blobLocalPath)}`,
            newFilepath,
            AZURE_BLOB_CONTAINER_NAME.PUBLIC_BLOB
          )
        }
        return {
          blobURL: 
            NODE_ENV === NODE_ENVIRONMENTS.PRODUCTION ? 
              thumbnailOrigFilepath : 
              `${BACKEND_HOST}/v1/products/${productId}/${PRODUCT_BLOB_TYPE.THUMBNAIL}.${this.getBlobExtension(blobLocalPath)}`,
          // blobURL: thumbnailOrigFilepath,
          originalFilepath: thumbnailOrigFilepath
        }
      }
    } catch (error) {
      throw error
    }
  }
  /**
   * create new product.
   * @param productBody 
   *  - filepath: path of the file that uploaded on the server.
   */
  public uploadAll = async (productId: string, productBody: IUploadProductBlob) => {
    try {
      const {contentZip, previewVideo, previewImage} = productBody
      const uploadedBlobURLs = <IUploadProductBlobResponse>{}
      if (contentZip) {
        const q = this.uploadBlob(productId, PRODUCT_BLOB_TYPE.CONTENT_ZIP, contentZip)
      }
      if (previewImage) {
        uploadedBlobURLs.previewImage = await this.uploadBlob(productId, PRODUCT_BLOB_TYPE.PREVIEW_IMAGE, previewImage)
        uploadedBlobURLs.thumbnail = await this.uploadBlob(productId, PRODUCT_BLOB_TYPE.THUMBNAIL, previewImage)
      }
      if (previewVideo) {
        uploadedBlobURLs.previewVideo = await this.uploadBlob(productId, PRODUCT_BLOB_TYPE.PREVIEW_VIDEO, previewVideo)
      }
      // add logs
      return uploadedBlobURLs
    } catch (error) {
      console.log('failed to create product. \nError :>> ', error);
      throw error
    }
  }

  private uploadBlob = async (productId: string, productBlobType: PRODUCT_BLOB_TYPE, blobLocalPath: string) => {
    let blobProperty = <IProductBlobProperties>{
      blobURL: '',
      originalFilepath: '',
      state: PRODUCT_UPLOAD_BLOB_STATES.PENDING
    }
    try {
      const response = await this.uploadOne(productId, productBlobType, blobLocalPath)
      blobProperty = {
        ...response,
        state: PRODUCT_UPLOAD_BLOB_STATES.COMPLETED
      }
    } catch (error) {
      blobProperty.state = PRODUCT_UPLOAD_BLOB_STATES.FAILED
    }
    return blobProperty
  }
}