import { AZURE_BLOB_SAS_TOKEN, BACKEND_HOST, NODE_ENV } from '../../../utils/constants';
import { IProductBlobProperties, IProductContentZip, PRODUCT_BLOB_TYPE } from '../../entities/product';
import {  IImageResizeOption, IUploader } from '../../interfaces';
import http from 'axios'
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
interface IDependencies {
  fileUploader: IUploader
  imageResizer: (option: IImageResizeOption) => Promise<string>
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
        const originalFilepath = await this.dependencies.fileUploader.upload(productId, contentZip)
        const hash = <string> await new Promise(async (resolve) => {
          console.log('originxxalFilepath :>> ', `${originalFilepath}${AZURE_BLOB_SAS_TOKEN}`);
          let b64
          // if (NODE_ENV === 'production') {
            const {data} = await http({
              method: "GET",
              url: `${originalFilepath}${AZURE_BLOB_SAS_TOKEN}`
            })
            b64 = data
          // } else {
          //   b64 = fs.readFileSync(originalFilepath, {encoding: 'base64'})
          // }
          const h = md5(Buffer.from(b64, 'base64'))
          resolve(h)
          return
        })
        // upload to cloud storage provider
        uploadedBlobURLs.contentZip = {
          blobURL: `${BACKEND_HOST}/v1/products/${productId}/${PRODUCT_BLOB_TYPE.CONTENT_ZIP}.${this.getBlobExtension(contentZip)}`,
          originalFilepath: await this.dependencies.fileUploader.upload(productId, contentZip),
          version: 0,
          hash
        }
      }
      if (previewImage) {
        // upload to cloud storage provider
        uploadedBlobURLs.previewImage = {
          blobURL: `${BACKEND_HOST}/v1/products/${productId}/${PRODUCT_BLOB_TYPE.PREVIEW_IMAGE}.${this.getBlobExtension(previewImage)}`,
          originalFilepath: await this.dependencies.fileUploader.upload(productId, previewImage)
        }
        const origFilepath = uploadedBlobURLs.previewImage.originalFilepath.split('.')
        const blobType = origFilepath.pop()
        const 
          width = 400;
        const newFilepath = `${origFilepath.join('.')}-w${width}.${blobType}`
        // resize the image preview to 150(h)x150(w)
        await this.dependencies.imageResizer({
          filepath: uploadedBlobURLs.previewImage.originalFilepath,
          width,
          newFilepath 
        })
        uploadedBlobURLs.thumbnail = {
          blobURL: `${BACKEND_HOST}/v1/products/${productId}/${PRODUCT_BLOB_TYPE.THUMBNAIL}.${this.getBlobExtension(previewImage)}`,
          originalFilepath: newFilepath
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