import { BACKEND_HOST } from '../../../utils/constants';
import { IProductBlobProperties, IProductContentZip, PRODUCT_BLOB_TYPE } from '../../entities/product';
import {  IUploader } from '../../interfaces';
interface IUploadProductBlob{
  contentZip: string,
  previewImage: string,
  previewVideo: string,
}
interface IUploadProductBlobResponse {
  contentZip: IProductContentZip,
  previewImage: IProductBlobProperties,
  previewVideo: IProductBlobProperties,
}
interface IDependencies {
  fileUploader: IUploader
}
export class UploadProductBlobService {
  constructor(protected dependencies: IDependencies) {
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
        const blobArr = contentZip.split('.')
        // upload to cloud storage provider
        uploadedBlobURLs.contentZip = {
          blobURL: `${BACKEND_HOST}/v1/products/${productId}/${PRODUCT_BLOB_TYPE.CONTENT_ZIP}.${this.getBlobExtension(contentZip)}`,
          originalFilepath: await this.dependencies.fileUploader.upload(productId, contentZip),
          version: 0
        }
      }
      if (previewImage) {
        // upload to cloud storage provider
        uploadedBlobURLs.previewImage = {
          blobURL: `${BACKEND_HOST}/v1/products/${productId}/${PRODUCT_BLOB_TYPE.PREVIEW_IMAGE}.${this.getBlobExtension(previewImage)}`,
          originalFilepath: await this.dependencies.fileUploader.upload(productId, previewImage)
        }
      }
      if (previewVideo) {
        // upload to cloud storage provider
        uploadedBlobURLs.previewVideo = {
          blobURL: `${BACKEND_HOST}/v1/products/${productId}/${PRODUCT_BLOB_TYPE.PREVIEW_VIDEO}.${this.getBlobExtension(previewVideo)}`,
          originalFilepath: await this.dependencies.fileUploader.upload(productId, previewVideo)
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