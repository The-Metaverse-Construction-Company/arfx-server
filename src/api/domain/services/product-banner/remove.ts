import {
  IProductBannerRepositoryGateway
} from '../../entities/product-banner'
import {
  IGeneralServiceDependencies
} from '../../interfaces'
interface IServiceDependencies extends IGeneralServiceDependencies<IProductBannerRepositoryGateway>{
}
export class RemoveProductBannerService {
  constructor (protected deps: IServiceDependencies) {
  }
  public removeOne = async (bannerId: string) => {
    try {
      // remove the product banner on the repository.
      const removedProductBanner = await this.deps.repositoryGateway.removeOne({
        _id: bannerId
      })
      //add some logs
      return removedProductBanner
    } catch (error) {
      console.log('failed to remove product banner. \nError:>> ', error);
      throw error
    }
  }
}