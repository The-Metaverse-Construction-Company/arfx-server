import {
  IProdutBody,
  IProductRepositoryGateway,
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
      const {contentZip, previewVideo, previewImage, discountPercentage = 0, published = true} = productBody
      const newProductEntity = new ProductEntity({
        name: productBody.name,
        description: productBody.description,
        title: productBody.title,
        adminAccountId: adminAccountId,
        price: productBody.price,
        published,
        discountPercentage
      })
      // upload to cloud storage provider
      const blobResponse = await this.dependencies.uploadProductBlobService.uploadAll(newProductEntity._id, {
        contentZip,
        previewImage,
        previewVideo
      })
      newProductEntity.previewImage = blobResponse.previewImage
      newProductEntity.previewVideo = blobResponse.previewVideo
      newProductEntity.contentZip = blobResponse.contentZip
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