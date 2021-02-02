import {  IUploader } from '../../interfaces';
interface IUploadProductBlob{
  contentZip: string,
  previewImage: string,
  previewVideo: string,
}
interface IUploadProductBlobResponse {
  contentURL?: string,
  previewImageURL?: string,
  previewVideoURL?: string,
}
interface IDependencies {
  fileUploader: IUploader
}
export class UploadProductBlobService {
  constructor(protected dependencies: IDependencies) {
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
        // upload to cloud storage provider
        uploadedBlobURLs.contentURL = await this.dependencies.fileUploader.upload(productId, contentZip)
      }
      if (previewImage) {
        // upload to cloud storage provider
        uploadedBlobURLs.previewImageURL = await this.dependencies.fileUploader.upload(productId, previewImage)
      }
      if (previewVideo) {
        // upload to cloud storage provider
        uploadedBlobURLs.previewVideoURL = await this.dependencies.fileUploader.upload(productId, previewVideo)
      }
      // add logs
      return uploadedBlobURLs
    } catch (error) {
      console.log('failed to create product. \nError :>> ', error);
      throw error
    }
  }
}