import {
  IProductEntity,
  IProductRepositoryGateway,
  IProdutBody
} from '../../entities/product'
import {
  ProductEntity
} from '../../entities'

import { IGeneralServiceDependencies } from '../../interfaces';
import { UploadProductBlobService } from './upload-blob';
export interface IProductParams extends IProdutBody{
  contentZip: string,
  previewImage: string,
  previewVideo: string,
}
interface IDependencies extends IGeneralServiceDependencies<IProductRepositoryGateway> {
  uploadProductBlobService: UploadProductBlobService
}
export class UpdateProduct {
  constructor(protected dependencies: IDependencies) {
  }
  /**
   * create new product.
   * @param productBody 
   */
  public updateOne = async (productId: string, productBody: IProductParams) => {
    try {
      const {contentZip, previewVideo, previewImage} = productBody
      const newProductEntity = new ProductEntity({
        ...productBody,
        _id: productId
      })
      const fieldsToUpdate = <Partial<IProductEntity>> {
        name: newProductEntity.name,
        description: newProductEntity.description,
        title: newProductEntity.title,
        price: newProductEntity.price,
        published: newProductEntity.published,
        updatedAt: newProductEntity.updatedAt,
      }
      // upload to cloud storage provider
      const {contentURL, previewImageURL, previewVideoURL} = await this.dependencies.uploadProductBlobService.uploadAll(newProductEntity._id, {
        contentZip,
        previewImage,
        previewVideo
      })
      if (previewImageURL) {
        fieldsToUpdate.previewImageURL = previewImageURL
      }
      if (previewVideoURL) {
        fieldsToUpdate.previewVideoURL = previewVideoURL
      }
      if (contentURL) {
        fieldsToUpdate.contentURL = contentURL
      }
      const updatedProduct = await this.dependencies.repositoryGateway.updateOne({
        _id: newProductEntity._id
      }, fieldsToUpdate)
      // add logs
      return updatedProduct
    } catch (error) {
      console.log('failed to update product. \nError :>> ', error);
      throw error
    }
  }
}