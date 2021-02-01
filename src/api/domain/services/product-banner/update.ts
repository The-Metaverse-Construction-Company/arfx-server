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
export class UpdateProductBannerService {
  constructor (protected deps: IServiceDependencies) {
  }
  public updateOne = async (bannerId: string, data: IProductBannerParams) => {
    try {
      const {
        active = true,
        adminAccountId = '',
        productId = ''
      } = data
      const productBanner = new ProductBannerEntity({
        _id: bannerId,
        active,
        adminAccountId,
        productId
      })
      // insert product banner on the repository
      const updatedBanner = await this.deps.repositoryGateway.updateOne({
        _id: productBanner._id
      },
        {
          active: productBanner.active,
          productId: productBanner.productId
          // adminAccountId: productBanner.adminAccountId
        })
      //add some logs
      return productBanner
    } catch (error) {
      console.log('failed to update product banner. \nError:>> ', error);
      throw error
    }
  }
}