import {
  IFeaturedProductRepositoryGateway
} from '../../entities/featured-product'
import {
  IGeneralServiceDependencies
} from '../../interfaces'
interface IServiceDependencies extends IGeneralServiceDependencies<IFeaturedProductRepositoryGateway>{
}
export class RemoveFeaturedProductService {
  constructor (protected deps: IServiceDependencies) {
  }
  public removeOne = async (bannerId: string) => {
    try {
      // remove the product banner on the repository.
      const removedFeaturedProduct = await this.deps.repositoryGateway.removeOne({
        _id: bannerId
      })
      //add some logs
      return removedFeaturedProduct
    } catch (error) {
      console.log('failed to remove product banner. \nError:>> ', error);
      throw error
    }
  }
}