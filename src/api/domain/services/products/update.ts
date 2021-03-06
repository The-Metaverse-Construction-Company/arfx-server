/**
 * @entity_interfaces
 */
import {
  IProductEntity,
  IProductParams,
  IProductRepositoryGateway,
} from '../../entities/product'
/**
 * @entity
 */
import {
  ProductEntity
} from '../../entities'
/**
 * @general_interfaces
 */
import { IGeneralServiceDependencies, IValidateProductTotalAmount } from '../../interfaces';
/**
 * @services
 */
import { UploadProductBlobService } from './upload-blob';
export interface _IProductParams extends IProductParams{
  contentZip: string,
  previewImage: string,
  previewVideo: string,
}
interface IDependencies extends IGeneralServiceDependencies<IProductRepositoryGateway> {
  uploadProductBlobService: UploadProductBlobService
  validateProductTotalAmount: IValidateProductTotalAmount
}
export class UpdateProduct {
  constructor(protected dependencies: IDependencies) {
  }
  /**
   * update the selected product details.
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
      // calculate the total price and validate it if its not below $0.50 usd.
      // payment gateway provider have a limit of $0.50 as it's minimum amount and with a maximum amount of $999,999.99 for the transaction.
      // reference link: https://support.chargebee.com/support/solutions/articles/228511-transaction-amount-limit-in-stripe#:~:text=The%20minimum%20amount%20for%20processing,Click%20Here%20for%20other%20currencies.
      if (!this.dependencies.validateProductTotalAmount(newProductEntity.price, newProductEntity.discountPercentage)) {
        throw new Error('total price must not be below $0.50 usd.')
      }
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