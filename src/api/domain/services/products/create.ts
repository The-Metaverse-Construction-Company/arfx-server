import {
  IProdutBody,
  IProductRepositoryGateway
} from '../../entities/product'
import {
  ProductEntity
} from '../../entities'
import { IGeneralServiceDependencies, IUploader } from '../../interfaces';
import {UploadProductBlobService} from './upload-blob'
export interface IProdutParams extends IProdutBody{
  contentZip: string,
  previewImage: string,
  previewVideo: string,
}
interface IDependencies extends IGeneralServiceDependencies<IProductRepositoryGateway> {
  uploadProductBlobService: UploadProductBlobService
}
export class CreateProductService {
  constructor(protected dependencies: IDependencies) {
  }
  /**
   * create new product.
   * @param productBody 
   *  - filepath: path of the file that uploaded on the server.
   */
  public createOne = async (productBody: IProdutParams, adminAccountId: string) => {
    try {
      const {contentZip, previewVideo, previewImage} = productBody
      const newProductEntity = new ProductEntity({
        ...productBody,
        adminAccountId: adminAccountId,
      })
      // upload to cloud storage provider
      const {contentURL, previewImageURL, previewVideoURL} = await this.dependencies.uploadProductBlobService.uploadAll(newProductEntity._id, {
        contentZip,
        previewImage,
        previewVideo
      })
      newProductEntity.previewImageURL = previewImageURL || ''
      newProductEntity.previewVideoURL = previewVideoURL || ''
      newProductEntity.contentURL = contentURL || ''
      // insert it thru the repo.
      await this.dependencies.repositoryGateway.insertOne(newProductEntity)
      // add logs
      return newProductEntity
    } catch (error) {
      console.log('failed to create product. \nError :>> ', error);
      throw error
    }
  }
}