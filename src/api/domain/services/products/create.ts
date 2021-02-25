import {
  IProductEntity,
  IProductRepositoryGateway,
  IProductParams
} from '../../entities/product'
import {
  ProductEntity
} from '../../entities'
import { IGeneralServiceDependencies, IUploader, IValidateProductTotalAmount } from '../../interfaces';
import {UploadProductBlobService} from './upload-blob'
export interface _IProdutParams extends IProductParams, Pick<IProductEntity, 'published'> {
  contentZip: string,
  previewImage: string,
  previewVideo: string,
}
interface IDependencies extends IGeneralServiceDependencies<IProductRepositoryGateway> {
  uploadProductBlobService: UploadProductBlobService
  validateProductTotalAmount: IValidateProductTotalAmount
}
export class CreateProductService {
  constructor(protected dependencies: IDependencies) {
  }
  /**
   * create new product.
   * @param productBody 
   *  - filepath: path of the file that uploaded on the server.
   */
  public createOne = async (productBody: _IProdutParams, adminAccountId: string) => {
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
      // calculate the total price and validate it if its not below $0.50 usd.
      // payment gateway provider have a limit of $0.50 as it's minimum amount and with a maximum amount of $999,999.99 for the transaction.
      // reference link: https://support.chargebee.com/support/solutions/articles/228511-transaction-amount-limit-in-stripe#:~:text=The%20minimum%20amount%20for%20processing,Click%20Here%20for%20other%20currencies.
      if (!this.dependencies.validateProductTotalAmount(newProductEntity.price, newProductEntity.discountPercentage)) {
        throw new Error('total price must not be below $0.50 usd.')
      }
      // upload to cloud storage provider
      // const blobResponse = await this.dependencies.uploadProductBlobService.uploadAll(newProductEntity._id, {
      //   contentZip,
      //   previewImage,
      //   previewVideo
      // })
      // merge to newProductEntity object to blob response
      // Object.assign(newProductEntity, blobResponse)
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