import {
  IProductEntity,
  IProductParams,
  IProductRepositoryGateway,
  IProdutBody
} from '../../entities/product'
import {
  ProductEntity
} from '../../entities'

import { IGeneralServiceDependencies } from '../../interfaces';
import { UploadProductBlobService } from './upload-blob';
export interface _IProductParams extends IProductParams{
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
  public updateOne = async (productId: string, productBody: _IProductParams) => {
    try {
      const {contentZip, previewVideo, previewImage, ..._productBody} = productBody
      // initiate product entity to validate the submitted fields on the business rules.
      const product = await this.dependencies.repositoryGateway.findOne({
        _id: productId
      })
      const newProductEntity = new ProductEntity({
        ..._productBody,
        contentZip: product.contentZip,
        _id: productId,
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
      const blobResponse = await this.dependencies.uploadProductBlobService.uploadAll(newProductEntity._id, {
        contentZip,
        previewImage,
        previewVideo
      })
      if (blobResponse.contentZip) {
        blobResponse.contentZip.version = newProductEntity.contentZip.version + 1
      }
      // merge to fieldsToUpload object
      Object.assign(fieldsToUpdate, blobResponse)
      // update to repository
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