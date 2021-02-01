import {
  IProductBannerParams,
  IProductBannerRepositoryGateway
} from '../../entities/product-banner'
import {
  ProductBannerEntity
} from '../../entities'
import {
  IGeneralServiceDependencies
} from '../../interfaces'
interface IServiceDependencies extends IGeneralServiceDependencies<IProductBannerRepositoryGateway>{
}
export class CreateProductBannerService {
  constructor (protected deps: IServiceDependencies) {
  }
  public createOne = async (data: IProductBannerParams) => {
    try {
      const {
        active = true,
        adminAccountId = '',
        productId = ''
      } = data
      const newProductBanner = new ProductBannerEntity({
        active,
        adminAccountId,
        productId
      })
      // insert product banner on the repository
      const productBanner = await this.deps.repositoryGateway.insertOne(newProductBanner)
      //add some logs
      return newProductBanner
    } catch (error) {
      console.log('failed to create product banner. \nError:>> ', error);
      throw error
    }
  }
}