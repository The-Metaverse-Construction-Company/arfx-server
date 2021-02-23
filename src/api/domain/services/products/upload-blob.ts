import { NODE_ENV, AZURE_BLOB_CONTAINER_NAME } from '../../../utils/constants';
import { IProductBlobProperties, IProductContentZip, IProductRepositoryGateway, PRODUCT_BLOB_TYPE } from '../../entities/product';
import {  IGeneralServiceDependencies, IImageResizeOption, IUploader } from '../../interfaces';
import fs from 'fs'
import md5 from 'md5'
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
  private getBlobExtension = (filename: string) => {
    const blobArr = filename.split('.')
    return blobArr.length >= 1 ? blobArr[blobArr.length -1] : ''
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
        const blobName = `${productId}-${PRODUCT_BLOB_TYPE.CONTENT_ZIP}.${this.getBlobExtension(contentZip)}`
        this.dependencies.fileUploader.upload(
          blobName,
          contentZip, 
          AZURE_BLOB_CONTAINER_NAME.PRIVATE_BLOB,
          true
        )
        .then(async (origFilepath) => {
          console.log('o@@@@@@@@@@@@@@@@@@@@@@@@@@@@@222rigFilepath :>> ', origFilepath);
          console.log('o@@@@@@@@@@@@@@@@@@@@@@@@@@@@rigFilepath :>> ', blobName);
          const hash = <string> await new Promise(async (resolve) => {
            let b64 = ''
            // if (NODE_ENV === 'production') {
              try {
                b64 = await this.dependencies.fileUploader.download(AZURE_BLOB_CONTAINER_NAME.PRIVATE_BLOB, blobName)
              } catch (error) {
                console.log('fucking error: ', error);
              }
                
            // } else {
            //   b64 = fs.readFileSync(origFilepath, {encoding: 'base64'})
            // }
            const h = b64 ? md5(Buffer.from(b64, 'base64')) : ''
            resolve(h)
            return
          })
          this.dependencies.repositoryGateway.updateOne({
            _id: productId
          }, {
            contentZip: {
              // blobURL: NODE_ENV === 'PROD' ? origFilepath : `${BACKEND_HOST}/v1/products/${productId}/${PRODUCT_BLOB_TYPE.CONTENT_ZIP}.${this.getBlobExtension(contentZip)}`,
              blobURL: origFilepath,
              originalFilepath: origFilepath,
              version: 0,
              hash
            }
          })
        })
      }
      if (previewImage) {
        const origFilepath = await this.dependencies.fileUploader.upload(
            `${productId}-${PRODUCT_BLOB_TYPE.PREVIEW_IMAGE}.${this.getBlobExtension(previewImage)}`,
            previewImage,
            AZURE_BLOB_CONTAINER_NAME.PUBLIC_BLOB
          )
        // upload to cloud storage provider
        uploadedBlobURLs.previewImage = {
          // blobURL: NODE_ENV === 'PROD' ? origFilepath : `${BACKEND_HOST}/v1/products/${productId}/${PRODUCT_BLOB_TYPE.PREVIEW_IMAGE}.${this.getBlobExtension(previewImage)}`,
          blobURL: origFilepath,
          originalFilepath: origFilepath
        }
        const origPreviewImage = previewImage.split('.')
        const blobType = origPreviewImage.pop()
        const 
          width = 400;
        const newFilepath = `${origPreviewImage.join('.')}-w${width}.${blobType}`
        // resize the image preview to 150(h)x150(w)
        await this.dependencies.imageResizer({
          filepath: previewImage,
          width,
          newFilepath 
        })
        let thumbnailOrigFilepath = newFilepath
        // if (NODE_ENV === 'PROD') {
          thumbnailOrigFilepath = await this.dependencies.fileUploader.upload(
            `${productId}-${PRODUCT_BLOB_TYPE.THUMBNAIL}.${this.getBlobExtension(previewImage)}`,
            newFilepath,
            AZURE_BLOB_CONTAINER_NAME.PUBLIC_BLOB
          )
          setTimeout(() => {
            // unlink or remove the newly generated thumbnail file on the file system.
            fs.unlinkSync(newFilepath)
          }, 2500)
        // }
        uploadedBlobURLs.thumbnail = {
          // blobURL: NODE_ENV === 'PROD' ? origFilepath : `${BACKEND_HOST}/v1/products/${productId}/${PRODUCT_BLOB_TYPE.THUMBNAIL}.${this.getBlobExtension(previewImage)}`,
          blobURL: thumbnailOrigFilepath,
          originalFilepath: thumbnailOrigFilepath
        }
      }
      if (previewVideo) {
        const origFilepath = await this.dependencies.fileUploader.upload(
          `${productId}-${PRODUCT_BLOB_TYPE.PREVIEW_VIDEO}.${this.getBlobExtension(previewVideo)}`,
          previewVideo,
          AZURE_BLOB_CONTAINER_NAME.PUBLIC_BLOB
          )
        // upload to cloud storage provider
        uploadedBlobURLs.previewVideo = {
          // blobURL: NODE_ENV === 'PROD' ? origFilePath : `${BACKEND_HOST}/v1/products/${productId}/${PRODUCT_BLOB_TYPE.PREVIEW_VIDEO}.${this.getBlobExtension(previewVideo)}`,
          blobURL: origFilepath,
          originalFilepath: origFilepath 
        }
      }
      // add logs
      return uploadedBlobURLs
    } catch (error) {
      console.log('failed to create product. \nError :>> ', error);
      throw error
    }
  }
}